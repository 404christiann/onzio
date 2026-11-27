import Image from "next/image";
import { ClubShowcase } from "@/components/club-showcase";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { PricingSection } from "@/components/pricing-section";
import { SiteHeader } from "@/components/site-header";
import { AdminTour } from "@/components/stageshow/admin-tour";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-inner shell">
            <p className="hero-breadcrumb">For soccer clubs, academies and leagues</p>
            <h1 id="hero-title">Your club&apos;s website, and the admin that runs it.</h1>
            <p className="hero-copy">
              Onzio builds your public site and gives your staff one admin for player registration and payments,
              rosters, schedules and results, match video, and every page on the site.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#tour">See the admin</a>
              <a className="button button-secondary" href="#contact">Talk to us</a>
            </div>
          </div>
          <figure className="hero-product shell" id="tour">
            <AdminTour />
          </figure>
        </section>

        <ClubShowcase />

        <PricingSection />

        <Faq />

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="shell contact-grid">
            <div className="contact-copy">
              <h2 id="contact-title">Talk to us about your club</h2>
              <p>Tell us what you run and what you use today. We&apos;ll set up a call and walk you through the admin.</p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <a className="footer-brand" href="#top" aria-label="Onzio home">
            <Image src="/onzio-logo.png" alt="Onzio" width={500} height={500} unoptimized />
          </a>
          <p>Websites and admin for soccer clubs.</p>
          <p>© {new Date().getFullYear()} Onzio</p>
        </div>
      </footer>
    </>
  );
}
