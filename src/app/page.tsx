import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { PricingSection } from "@/components/pricing-section";
import { SiteHeader } from "@/components/site-header";
import { AdminTour } from "@/components/stageshow/admin-tour";
import { StaffTools } from "@/components/staff-tools";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-inner shell">
            <h1 id="hero-title" className="hero-title"><span>Your club deserves</span>{" "}<em>a better home.</em></h1>
            <p className="hero-copy">
              Onzio hosts your site and gives staff one admin for pages, schedules, rosters, and registration, whether you run one club or a whole league.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#tour">See the admin</a>
              <a className="button button-secondary" href="#contact">Talk to us</a>
            </div>
            <figure className="hero-product" id="tour">
              <AdminTour />
            </figure>
          </div>
        </section>

        <StaffTools />

        <PricingSection />

        <Faq />

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="shell contact-grid">
            <div className="contact-copy">
              <h2 id="contact-title">What&apos;s next for your club?</h2>
              <p>Share a few details. We&apos;ll talk about how Onzio could help.</p>
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
          <p>Built for the world&apos;s game.</p>
          <p>© {new Date().getFullYear()} Onzio</p>
        </div>
      </footer>
    </>
  );
}
