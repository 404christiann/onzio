"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const links = [
  { href: "#product", label: "Product" },
  { href: "#club-sites", label: "Club sites" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [activeHref, setActiveHref] = useState<string | null>(links[0].href);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pendingHref = useRef<string | null>(null);
  const pendingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndex = links.findIndex((link) => link.href === activeHref);

  const selectDestination = (href: string) => {
    if (mobileMenuRef.current?.matches(":popover-open")) mobileMenuRef.current.hidePopover();
    pendingHref.current = href;
    setActiveHref(href);
    if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
    // Keep the clicked destination selected while native anchor scrolling runs.
    pendingTimeout.current = setTimeout(() => {
      pendingHref.current = null;
      pendingTimeout.current = null;
    }, 1500);
  };

  useEffect(() => {
    const sections = [...links.map((link) => link.href), "#contact"]
      .map((href) => ({ href, element: document.getElementById(href.slice(1)) }))
      .filter((section) => section.element !== null);
    let frame = 0;

    const updateActive = () => {
      frame = 0;
      if (pendingHref.current) return;
      const readingLine = (headerRef.current?.getBoundingClientRect().bottom ?? 88) + 120;
      let current: string = links[0].href;
      for (const section of sections) {
        if (section.element!.getBoundingClientRect().top <= readingLine) current = section.href;
      }
      setActiveHref(current === "#contact" ? null : current);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateActive);
    };
    const releasePending = () => {
      pendingHref.current = null;
      if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
      pendingTimeout.current = null;
      scheduleUpdate();
    };
    const followHash = () => {
      const href = window.location.hash;
      if ([...links.map((link) => link.href), "#contact", "#top"].includes(href)) {
        selectDestination(href === "#top" ? links[0].href : href);
      }
    };

    updateActive();
    followHash();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", followHash);
    window.addEventListener("scrollend", releasePending);
    window.addEventListener("wheel", releasePending, { passive: true });
    window.addEventListener("touchstart", releasePending, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", followHash);
      window.removeEventListener("scrollend", releasePending);
      window.removeEventListener("wheel", releasePending);
      window.removeEventListener("touchstart", releasePending);
    };
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 821px)");
    const closeOnDesktop = () => {
      if (desktop.matches && mobileMenuRef.current?.matches(":popover-open")) {
        mobileMenuRef.current.hidePopover();
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <nav className="shell nav" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Onzio home" onClick={() => selectDestination(links[0].href)}>
          <Image className="wordmark-image" src="/onzio-logo.png" alt="" width={500} height={500} loading="eager" unoptimized />
        </a>

        <div
          className="nav-pill-links"
          style={{ "--active-index": Math.max(activeIndex, 0) } as CSSProperties}
        >
          <span className={`nav-pill-indicator${activeIndex < 0 ? " is-hidden" : ""}`} aria-hidden="true" />
          {links.map((link) => (
            <a
              href={link.href}
              key={link.href}
              aria-current={activeHref === link.href ? "location" : undefined}
              onClick={() => selectDestination(link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <a className="button button-primary button-small" href="#contact" onClick={() => selectDestination("#contact")}>Get started</a>
          <button
            className="nav-toggle"
            type="button"
            popoverTarget="mobile-navigation"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          >
            <span /><span />
          </button>
        </div>
      </nav>
      <div
        className="nav-mobile-menu"
        id="mobile-navigation"
        ref={mobileMenuRef}
        popover="auto"
        onToggle={(event) => setIsMenuOpen(event.currentTarget.matches(":popover-open"))}
      >
        <nav aria-label="Mobile navigation">
          {links.map((link) => (
            <a
              href={link.href}
              key={link.href}
              aria-current={activeHref === link.href ? "location" : undefined}
              onClick={() => selectDestination(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
