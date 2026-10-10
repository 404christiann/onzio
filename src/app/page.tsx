import Image from "next/image";
import { CentralIcon } from "@/components/icons/central/icon";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { PlatformShowcase } from "@/components/platform-showcase";
import { PricingSection } from "@/components/pricing-section";
import { SiteHeader } from "@/components/site-header";
import { StaffTools } from "@/components/staff-tools";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-inner shell">
            <h1 id="hero-title"><span>Your club deserves</span>{" "}<em>a better home.</em></h1>
            <p className="hero-copy">
              A professional website for your community. A simple place for your staff to keep it all moving.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#staff-tools"><CentralIcon name="grid" width={18} height={18} /> Explore the platform</a>
              <a className="hero-text-link" href="#contact">Start a conversation</a>
            </div>
            <figure className="hero-product">
              <Image
                src="/onzio-diverse-city-product-mockup-white-v4.png"
                alt="Illustrative phones showing the Diverse City FC public website and the Onzio club admin portal"
                width={1448}
                height={1086}
                sizes="(max-width: 640px) 130vw, (max-width: 1000px) 95vw, 940px"
                loading="eager"
                unoptimized
              />
              <figcaption><span>What your community sees</span><span>What your staff controls</span></figcaption>
            </figure>
          </div>
        </section>

        <PlatformShowcase />

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
