"use client";

import Image from "next/image";
import { useState } from "react";

const links = [
  { href: "#product", label: "Product" },
  { href: "#club-sites", label: "Club sites" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <nav className="shell nav" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Onzio home" onClick={closeMenu}>
          <Image className="wordmark-image" src="/onzio-logo.png" alt="" width={500} height={500} loading="eager" unoptimized />
        </a>

        <div className="nav-desktop-links">
          {links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
        </div>

        <div className="nav-actions">
          <a className="button button-primary button-small" href="#contact" onClick={closeMenu}>Get started</a>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-nav ${isOpen ? "is-open" : ""}`} id="mobile-navigation">
        <div className="shell mobile-nav-inner">
          {links.map((link) => <a href={link.href} key={link.href} onClick={closeMenu}>{link.label}</a>)}
        </div>
      </div>
    </header>
  );
}
