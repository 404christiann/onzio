import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { PlatformShowcase } from "@/components/platform-showcase";
import { ProductTour } from "@/components/product-tour";
import { SiteHeader } from "@/components/site-header";
import { button } from "@/lib/styles";

const deportivoOlimpicoUrl = "https://deportivo-olimpico.vercel.app/";

const displayH2 =
  "font-display text-[clamp(47px,15vw,64px)] font-semibold uppercase leading-[0.94] tracking-[-0.035em] text-balance sm:text-[clamp(50px,6vw,76px)]";

const eyebrowLight =
  "inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-green-hover shadow-[0_0_0_1px_rgba(18,161,64,0.18),0_2px_6px_rgba(23,46,30,0.06)]";
const eyebrowDark =
  "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#7ee49e]";
const eyebrowDot = <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />;

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

const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" width="18" height="18">
    <path d="m4 9.5 3.1 3L14 5.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
  </svg>
);

const inclusions = ["Professional club website", "Hosting", "Admin portal", "Platform updates"];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        <section
          className="shell relative flex min-h-[min(760px,calc(100svh-88px))] flex-col items-center justify-center overflow-hidden pb-[72px] pt-[76px] text-center sm:pb-[84px] sm:pt-[96px]"
          aria-labelledby="hero-title"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[4%] h-[330px] w-[430px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(18,161,64,0.11),rgba(18,161,64,0)_68%)] sm:top-[12%] sm:h-[430px] sm:w-[660px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[-170px] top-[88px] size-[250px] rounded-full border border-green/10 after:absolute after:left-[42px] after:top-5 after:size-[7px] after:rounded-full after:bg-green after:shadow-[0_0_0_8px_rgba(18,161,64,0.08)] after:content-['']"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-7 right-[-190px] size-[320px] rounded-full border border-green/10 after:absolute after:bottom-8 after:right-16 after:size-[7px] after:rounded-full after:bg-green after:shadow-[0_0_0_8px_rgba(18,161,64,0.08)] after:content-['']"
          />
          <p className={`${eyebrowLight} relative animate-rise`} style={{ animationDelay: "80ms" }}>
            {eyebrowDot} Website and club platform
          </p>
          <h1
            id="hero-title"
            className="relative mt-5 max-w-[920px] animate-rise text-balance font-display text-[clamp(62px,20vw,86px)] font-bold uppercase leading-[0.86] tracking-[-0.045em] sm:mt-6 sm:text-[clamp(68px,9.2vw,120px)] sm:leading-[0.84]"
            style={{ animationDelay: "140ms" }}
          >
            Your club deserves<br />a better home.
          </h1>
          <p
            className="relative mt-6 max-w-[720px] animate-rise text-pretty text-[17px] leading-[1.55] tracking-[-0.025em] text-[#59665e] sm:mt-[30px] sm:text-[clamp(18px,2vw,22px)]"
            style={{ animationDelay: "210ms" }}
          >
            Onzio combines a professional club website with simple tools for keeping content, rosters, schedules, match stats, and programs up to date.
          </p>
          <div
            className="relative mt-[30px] flex w-full animate-rise flex-col items-center gap-3 sm:mt-9 sm:w-auto sm:flex-row"
            style={{ animationDelay: "280ms" }}
          >
            <a className={`${button()} w-full sm:w-auto`} href="#contact">Get started <ArrowRight /></a>
            <a className={`${button({ variant: "secondary" })} w-full sm:w-auto`} href="#product">See the platform</a>
          </div>
          <div
            className="relative mt-10 flex animate-rise flex-wrap items-center justify-center gap-2.5 text-xs font-medium tracking-[0.02em] text-[#728078] sm:mt-[54px] sm:gap-4"
            style={{ animationDelay: "350ms" }}
            aria-label="Onzio platform summary"
          >
            <span className="rounded-full bg-white/70 px-2.5 py-1.5 shadow-[0_0_0_1px_#dce4de] sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none">One managed platform</span>
            <span className="hidden size-[3px] rounded-full bg-[#a7b3aa] sm:block" aria-hidden="true" />
            <span className="rounded-full bg-white/70 px-2.5 py-1.5 shadow-[0_0_0_1px_#dce4de] sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none">Built for soccer clubs</span>
            <span className="hidden size-[3px] rounded-full bg-[#a7b3aa] sm:block" aria-hidden="true" />
            <span className="rounded-full bg-white/70 px-2.5 py-1.5 shadow-[0_0_0_1px_#dce4de] sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none">Month-to-month</span>
          </div>
        </section>

        <section className="relative bg-green-deep pb-24 pt-[84px] text-white sm:pt-[110px] md:pb-28" id="product" aria-labelledby="product-title">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-[300px] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full border border-white/[0.06]" />
            <div className="absolute -right-40 bottom-24 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(18,161,64,0.18),transparent_70%)]" />
          </div>
          <div className="shell relative z-10">
            <div className="mb-10 sm:mb-[54px]">
              <p className={eyebrowDark}>{eyebrowDot} Inside Onzio</p>
              <div className="mt-4 grid items-start gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.7fr)] md:items-end md:gap-20">
                <h2 className={displayH2} id="product-title">One place to run your club&apos;s digital home.</h2>
                <p className="max-w-[620px] text-pretty text-[15px] leading-[1.65] tracking-[-0.015em] text-[#adc2b4] sm:text-[17px] md:mb-1 md:max-w-[480px]">
                  Move from the public website to the details behind it without juggling separate systems or waiting on a developer for every update.
                </p>
              </div>
            </div>
            <ProductTour />
          </div>
        </section>

        <section className="scroll-mt-4 bg-white pb-24 pt-20 sm:pb-[140px] sm:pt-32 md:pt-40" id="club-sites" aria-labelledby="club-sites-title">
          <div className="shell">
            <div className="mb-10 sm:mb-[54px]">
              <p className={eyebrowLight}>{eyebrowDot} A club site in the wild</p>
              <div className="mt-4 grid items-start gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.7fr)] md:items-end md:gap-20">
                <h2 className={displayH2} id="club-sites-title">A public home shaped around the club.</h2>
                <p className="max-w-[620px] text-pretty text-[15px] leading-[1.65] tracking-[-0.015em] text-muted sm:text-[17px] md:mb-1 md:max-w-[480px]">
                  Deportivo Olimpico shows how Onzio can turn a club&apos;s identity, history, and ambitions into a distinctive public experience.
                </p>
              </div>
            </div>

            <div className="mb-7 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center sm:gap-[30px]">
              <div className="flex items-center gap-4 sm:gap-[17px]">
                <Image
                  className="size-[61px] rounded-full object-contain outline -outline-offset-1 outline-black/10 [filter:drop-shadow(0_2px_4px_rgba(23,46,30,0.18))] sm:size-[72px]"
                  src="/deportivo-olimpico-logo.png"
                  alt="Deportivo Olimpico crest"
                  width={960}
                  height={944}
                  sizes="72px"
                  unoptimized
                />
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-green-hover">Featured club site</p>
                  <h3 className="text-[22px] font-semibold tracking-[-0.035em]">Deportivo Olimpico</h3>
                  <p className="mt-1 text-xs text-muted">Guadalupe, California</p>
                </div>
              </div>
              <a
                className="group inline-flex items-center gap-2 whitespace-nowrap text-sm font-bold text-green-hover"
                href={deportivoOlimpicoUrl}
                target="_blank"
                rel="noreferrer"
              >
                View live site <span className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><ArrowRight diagonal /></span>
              </a>
            </div>
            <PlatformShowcase />
          </div>
        </section>

        <section className="scroll-mt-4 bg-ink py-[88px] text-white sm:py-32" id="pricing" aria-labelledby="pricing-title">
          <div className="shell grid items-center gap-[46px] md:grid-cols-[0.9fr_1.1fr] md:gap-16 lg:gap-[105px]">
            <div>
              <p className={eyebrowDark}>{eyebrowDot} Simple monthly pricing</p>
              <h2 className={`${displayH2} mt-5`} id="pricing-title">A professional platform without the agency overhead.</h2>
              <p className="mt-6 max-w-[620px] text-pretty text-[15px] leading-[1.65] text-[#9faca3] sm:text-[17px] md:max-w-[470px]">
                Start with the essentials your club needs today, on a month-to-month subscription that can grow with you.
              </p>
            </div>

            <article className="relative max-w-[640px] overflow-hidden rounded-[22px] bg-[linear-gradient(145deg,#133a25,#0a2417)] p-[25px] shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_28px_70px_rgba(0,0,0,0.28)] sm:p-[38px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-[100px] -top-[130px] size-[300px] rounded-full bg-[radial-gradient(circle,rgba(18,161,64,0.34),transparent_67%)]"
              />
              <div className="relative">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#85d99e]">Onzio managed platform</p>
                <div className="mt-5 flex flex-wrap items-end gap-[7px]">
                  <span className="w-full text-[13px] text-[#adbbb1]">Starting at</span>
                  <span className="font-display text-7xl font-bold leading-[0.8] tracking-[-0.035em] tabular-nums">$65</span>
                  <span className="mb-1.5 text-[15px] text-[#adbbb1]">/ month</span>
                </div>
                <p className="mt-[19px] text-[13px] text-[#c0ccc3]">Month-to-month. No annual commitment.</p>
              </div>
              <div className="relative mt-7 border-t border-white/10 pt-[26px]">
                <p className="mb-4 text-xs text-[#b7c4bb]">Every subscription includes:</p>
                <ul className="grid gap-[13px] sm:grid-cols-2 sm:gap-x-[18px]">
                  {inclusions.map((item) => (
                    <li className="flex items-center gap-[9px] text-[13px] font-medium text-[#eef4ef]" key={item}>
                      <span className="grid size-5 flex-none place-items-center rounded-full bg-green/20 text-[#6fe18f] [&>svg]:size-[13px]"><Check /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="relative mt-6 text-[11px] leading-[1.55] text-[#93a198]">Initial website setup is quoted separately. Domain registration is not included.</p>
              <a className={`${button()} relative mt-[26px] w-full`} href="#contact">Get started <ArrowRight /></a>
            </article>
          </div>
        </section>

        <section className="scroll-mt-4 bg-paper py-[88px] sm:py-32" id="faq" aria-labelledby="faq-title">
          <div className="shell">
            <div className="mx-auto mb-10 flex max-w-[760px] flex-col items-center text-center sm:mb-14">
              <p className={eyebrowLight}>{eyebrowDot} FAQ</p>
              <h2 className={`${displayH2} mt-5`} id="faq-title">Frequently asked questions.</h2>
            </div>
            <Faq />
          </div>
        </section>

        <section className="scroll-mt-4 bg-green-dark pb-[95px] pt-[88px] text-white sm:py-32" id="contact" aria-labelledby="contact-title">
          <div className="shell grid items-start gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-14 lg:gap-[100px]">
            <div className="max-w-[650px]">
              <p className={eyebrowDark}>{eyebrowDot} Start a conversation</p>
              <h2 className={`${displayH2} mt-[18px] sm:text-[clamp(58px,7vw,86px)]`} id="contact-title">Tell us about your club.</h2>
              <p className="mb-10 mt-6 max-w-[460px] text-pretty text-[15px] leading-[1.65] text-[#b4c8ba] sm:text-[17px]">
                Share a few details and your inquiry will go directly to Onzio.
              </p>
              <div className="mt-4 hidden items-center gap-3.5 sm:flex">
                <span className="grid size-9 flex-none place-items-center rounded-full font-mono text-[9px] text-[#79df99] shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" aria-hidden="true">01</span>
                <div><strong className="block text-[13px]">Keep it simple</strong><p className="mt-[3px] text-[11px] text-[#9db2a3]">Four quick fields. No long questionnaire.</p></div>
              </div>
              <div className="mt-4 hidden items-center gap-3.5 sm:flex">
                <span className="grid size-9 flex-none place-items-center rounded-full font-mono text-[9px] text-[#79df99] shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" aria-hidden="true">02</span>
                <div><strong className="block text-[13px]">Talk to the builder</strong><p className="mt-[3px] text-[11px] text-[#9db2a3]">Your inquiry goes directly to Christian.</p></div>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="bg-[#071c11] text-[#6e7a72]">
        <div className="shell grid min-h-[104px] grid-cols-[1fr_auto] items-center gap-3 py-5 text-xs sm:grid-cols-[1fr_auto_1fr] sm:gap-[30px]">
          <a className="relative block h-[30px] w-[88px] overflow-hidden opacity-85 brightness-0 invert" href="#top" aria-label="Onzio home">
            <Image
              className="absolute left-1/2 top-1/2 h-[122px] w-[122px] max-w-none -translate-x-1/2 -translate-y-1/2"
              src="/onzio-logo.png"
              alt="Onzio"
              width={500}
              height={500}
              unoptimized
            />
          </a>
          <p className="hidden sm:block">Built for the world&apos;s game.</p>
          <p className="text-right">© {new Date().getFullYear()} Onzio</p>
        </div>
      </footer>
    </>
  );
}
