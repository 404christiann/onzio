"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { button } from "@/lib/styles";

const links = [
  { href: "#product", label: "Product" },
  { href: "#club-sites", label: "Club sites" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const panelContentRef = useRef<HTMLDivElement | null>(null);
  const [panelMaxHeight, setPanelMaxHeight] = useState(0);

  useLayoutEffect(() => {
    if (panelContentRef.current) setPanelMaxHeight(panelContentRef.current.scrollHeight);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-3 z-50">
      <div className="shell">
        <nav
          className="flex min-h-16 items-center justify-between gap-5 rounded-full bg-white/85 py-2 pl-5 pr-2.5 shadow-[0_0_0_1px_rgba(16,23,18,0.08),0_2px_4px_rgba(16,23,18,0.04),0_12px_32px_rgba(16,23,18,0.08)] backdrop-blur-xl"
          aria-label="Primary navigation"
        >
          <a
            className="relative block h-[34px] w-[104px] flex-none overflow-hidden"
            href="#top"
            aria-label="Onzio home"
            onClick={closeMenu}
          >
            <Image
              className="absolute left-1/2 top-1/2 h-36 w-36 max-w-none -translate-x-1/2 -translate-y-1/2"
              src="/onzio-logo.png"
              alt=""
              width={500}
              height={500}
              loading="eager"
              unoptimized
            />
          </a>

          <div className="ml-auto hidden items-center gap-7 text-sm font-medium text-[#526057] min-[820px]:flex">
            {links.map((link) => (
              <a
                className="relative py-2.5 transition-colors duration-150 after:absolute after:inset-x-0 after:bottom-[5px] after:h-px after:origin-right after:scale-x-0 after:bg-green after:transition-transform after:duration-200 after:content-[''] hover:text-ink hover:after:origin-left hover:after:scale-x-100"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <a className={button({ size: "sm" })} href="#contact" onClick={closeMenu}>
              Get started
            </a>
            <button
              className="relative grid size-11 flex-none place-items-center rounded-full bg-white shadow-[0_0_0_1px_#dce4de] transition-transform duration-150 ease-out active:scale-[0.96] min-[820px]:hidden"
              type="button"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setIsOpen((open) => !open)}
            >
              <span
                className={`absolute h-[1.5px] w-[17px] bg-ink transition-transform duration-200 ease-out ${isOpen ? "rotate-45" : "-translate-y-[3px]"}`}
              />
              <span
                className={`absolute h-[1.5px] w-[17px] bg-ink transition-transform duration-200 ease-out ${isOpen ? "-rotate-45" : "translate-y-[3px]"}`}
              />
            </button>
          </div>
        </nav>

        <div
          id="mobile-navigation"
          className="overflow-hidden transition-[max-height] duration-200 ease-out min-[820px]:hidden"
          style={{ maxHeight: isOpen ? `${panelMaxHeight}px` : "0px" }}
        >
          <div ref={panelContentRef}>
            <div className="mt-2 grid gap-1 rounded-3xl bg-white/95 p-2 shadow-[0_0_0_1px_rgba(16,23,18,0.08),0_16px_40px_rgba(16,23,18,0.12)] backdrop-blur-xl">
              {links.map((link) => (
                <a
                  className="rounded-2xl px-4 py-3 text-[15px] font-semibold text-ink-soft transition-colors duration-150 hover:bg-paper hover:text-ink"
                  href={link.href}
                  key={link.href}
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
