import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { PlatformShowcase } from "@/components/platform-showcase";
import { ProductTour } from "@/components/product-tour";
import { PricingSection } from "@/components/pricing-section";
import { SiteHeader } from "@/components/site-header";

const diverseCityUrl = "https://diversecityfc.com/";

const ArrowRight = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 18 18" width="18" height="18">
    <path
      d={diagonal ? "M5 13 13 5M6 5h7v7" : "M3.5 9h11m-4-4 4 4-4 4"}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
);

const GridIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const FeatureIcon = ({ type }: { type: "publish" | "competition" | "access" | "analytics" }) => {
  if (type === "publish") {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 9h16M8 6.5h.01M11 6.5h.01M8 13h8M8 16h5"/></svg>;
  }
  if (type === "competition") {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM9 18h6M12 13v5M7.5 6H5v2a4 4 0 0 0 4 4M16.5 6H19v2a4 4 0 0 1-4 4"/></svg>;
  }
  if (type === "access") {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="9" cy="9" r="3"/><path d="M3.5 19c.7-3.2 2.5-5 5.5-5s4.8 1.8 5.5 5M16 10.5a2.5 2.5 0 1 0 0-5M16 14c2.5.1 4 1.5 4.5 4"/></svg>;
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 19V9M12 19V5M19 19v-7M3 19h18"/></svg>;
};

const features = [
  {
    type: "publish" as const,
    title: "Publish without a developer",
    copy: "Keep your homepage, programs, tryouts, sponsors, and club details current from a focused admin portal.",
  },
  {
    type: "competition" as const,
    title: "Keep the season organized",
    copy: "Manage rosters, schedules, match results, standings, and season stats from the same place.",
  },
  {
    type: "access" as const,
    title: "Give staff the right access",
    copy: "Invite approved club staff and keep sensitive administrative tools separate from the public site.",
  },
  {
    type: "analytics" as const,
    title: "See the season clearly",
    copy: "Turn match and player performance data into a clean view of how the club is progressing.",
  },
];

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
              <a className="button button-primary" href="#product"><GridIcon /> Explore the platform</a>
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

        <section className="product-section" id="product" aria-labelledby="product-title">
          <div className="shell">
            <div className="section-intro section-intro-light section-intro-direct">
              <div className="section-intro-grid">
                <h2 id="product-title">One place to run your club&apos;s digital home.</h2>
                <p>Your website, your season, your people. Explore the everyday tools that keep your club moving, all from the same place.</p>
              </div>
            </div>
            <ProductTour />
          </div>
        </section>

        <section className="feature-section shell" aria-labelledby="feature-title">
          <div className="section-intro compact-intro section-intro-direct">
            <div className="section-intro-grid">
              <h2 id="feature-title">The tools your staff will actually use.</h2>
              <p>Onzio keeps the everyday jobs visible, focused, and easy to hand off across your organization.</p>
            </div>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span className="feature-icon"><FeatureIcon type={feature.type} /></span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="club-site-section" id="club-sites" aria-labelledby="club-sites-title">
          <div className="shell">
            <div className="section-intro section-intro-direct">
              <div className="section-intro-grid">
                <h2 id="club-sites-title">A public home shaped around the club.</h2>
                <p>Diverse City FC shows how Onzio can turn a club&apos;s identity, programs, and community mission into a distinctive public experience.</p>
              </div>
            </div>

            <div className="case-study-heading">
              <div className="case-study-club">
                <Image
                  className="club-crest diverse-city-crest"
                  src="/diverse-city-fc-logo.png"
                  alt="Diverse City FC crest"
                  width={750}
                  height={750}
                />
                <div>
                  <p className="case-study-label">Featured club site</p>
                  <h3>Diverse City FC</h3>
                  <p>Chicago, Illinois</p>
                </div>
              </div>
              <a className="text-link" href={diverseCityUrl} target="_blank" rel="noreferrer">
                View live site <ArrowRight diagonal />
              </a>
            </div>
            <PlatformShowcase />
          </div>
        </section>

        <PricingSection />

        <section className="faq-section shell" id="faq" aria-labelledby="faq-title">
          <div className="faq-heading">
            <h2 id="faq-title">Common Questions</h2>
            <p>What clubs usually want to know before starting with Onzio.</p>
          </div>
          <Faq />
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="shell contact-grid">
            <div className="contact-copy">
              <p className="eyebrow"><span /> Start a conversation</p>
              <h2 id="contact-title">Tell us about your club.</h2>
              <p>Share a few details and your inquiry will go directly to Onzio.</p>
              <ul className="contact-points" aria-label="What to expect">
                <li className="contact-point">
                  <div><strong>Keep it simple</strong><p>Four quick fields. No long questionnaire.</p></div>
                </li>
                <li className="contact-point">
                  <div><strong>Talk to the builder</strong><p>Your inquiry goes directly to Christian.</p></div>
                </li>
              </ul>
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
