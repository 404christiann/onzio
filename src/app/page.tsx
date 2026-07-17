import { PlatformShowcase } from "@/components/platform-showcase";

const roseCityUrl = "https://rose-city-website.vercel.app";
const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://calendly.com/onzio";

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
    <path d="M4 12 12 4M5 4h7v7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

const ArrowDown = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15">
    <path d="M8 3v10m0 0 4-4m-4 4L4 9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

export default function Home() {
  return (
    <>
      <header className="site-header">
        <nav className="shell nav" aria-label="Primary navigation">
          <a className="wordmark" href="#top" aria-label="Onzio home">
            onzio <span className="wordmark-emoji" aria-hidden="true">⚽</span>
          </a>
          <div className="nav-links">
            <a className="nav-text-link" href="#work">Work</a>
            <a className="nav-text-link" href="#about">About</a>
            <a className="button button-small" href={bookingUrl} target="_blank" rel="noreferrer">Book a demo</a>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero shell" aria-labelledby="hero-title">
          <p className="eyebrow hero-eyebrow">Digital platforms for soccer clubs</p>
          <h1 id="hero-title">Your club deserves<br className="desktop-break" /> a better home.</h1>
          <p className="hero-copy">I design, build, and manage modern club websites that look professional and work beautifully.</p>
          <div className="hero-actions">
            <a className="button" href={bookingUrl} target="_blank" rel="noreferrer">Book a demo</a>
            <a className="text-action" href="#work">View the work <ArrowDown /></a>
          </div>
        </section>

        <section className="work-section shell" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Featured platform</p>
              <h2 id="work-title">Rose City FC</h2>
            </div>
            <a className="text-action case-link" href={roseCityUrl} target="_blank" rel="noreferrer">Visit the live site <ArrowUpRight /></a>
          </div>
          <p className="platform-intro">A public home for supporters, connected to a private workspace for the people running the club.</p>
          <PlatformShowcase />
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="shell about-grid">
            <p className="eyebrow">About</p>
            <div>
              <h2 id="about-title">Built by someone who understands both software and the game.</h2>
              <p className="about-copy">I&apos;m Christian Alcala, a software engineer building thoughtful digital experiences for soccer organizations. You work directly with me from the first conversation through launch and ongoing support.</p>
            </div>
          </div>
        </section>

        <section className="contact-section shell" id="contact" aria-labelledby="contact-title">
          <p className="eyebrow">Start a conversation</p>
          <h2 id="contact-title">Let&apos;s build your club&apos;s digital home.</h2>
          <p className="contact-copy">Book a short call to see the platform and talk about what your club needs.</p>
          <a className="button button-large" href={bookingUrl} target="_blank" rel="noreferrer">Book a demo <ArrowUpRight /></a>
        </section>
      </main>

      <footer>
        <div className="shell footer-inner">
          <span>© {new Date().getFullYear()} Onzio</span>
          <span>Built for the world&apos;s game.</span>
        </div>
      </footer>
    </>
  );
}
