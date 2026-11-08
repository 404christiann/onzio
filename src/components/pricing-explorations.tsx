import styles from "./pricing-explorations.module.css";
import { CentralIcon } from "@/components/icons/central/icon";
import { PlanBuilder, ProposalDemo } from "@/components/stageshow/pricing-demos";

// The two pricing directions that weren't chosen, kept for the exploration
// page. The chosen one is the homepage's PricingSection. Neither shows a
// monthly figure; both keep essentials in every plan, month-to-month, setup
// quoted separately and domain not included.

const ESSENTIALS = "Website, hosting, admin portal and updates";
const AUDIENCES = ["Clubs", "Academies", "Leagues", "Tournaments"];

function Cta({ children }: { children: React.ReactNode }) {
  return (
    <a className={styles.cta} href="#contact">
      {children}
      <CentralIcon name="arrow" className={styles.ctaIcon} />
    </a>
  );
}

function Audiences() {
  return (
    <ul className={styles.audiences} aria-label="Who Onzio is for">
      {AUDIENCES.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}

/* ---- 1. Plan builder: copy beside an organization picking its tools ---- */

export function PricingBuilder() {
  const promises = [
    `${ESSENTIALS} in every plan`,
    "Month-to-month, no annual commitment",
    "Website setup quoted separately, up front",
  ];
  return (
    <section className={styles.section} aria-labelledby="pricing-builder-title">
      <div className={styles.split}>
        <div className={styles.copyColumn}>
          <p className={styles.kicker}>Pricing</p>
          <h2 className={styles.title} id="pricing-builder-title">Priced around what you run.</h2>
          <p className={styles.copy}>
            A club, a league or a tournament: no tier chart to squeeze into. Tell us what you need and we&rsquo;ll quote one monthly plan for exactly that.
          </p>
          <ul className={styles.promises}>
            {promises.map(item => (
              <li key={item}><CentralIcon name="check" className={styles.check} />{item}</li>
            ))}
          </ul>
          <Cta>Get your quote</Cta>
          <p className={styles.fine}>Domain registration is not included.</p>
        </div>
        <div className={styles.picture}><PlanBuilder /></div>
      </div>
    </section>
  );
}

/* ---- 3. Proposal: how a quote happens, beside the plan being accepted ---- */

export function PricingProposal() {
  const steps = [
    { title: "Tell us what you run", body: "A club, a league or a tournament: teams, programs and what your staff do every week." },
    { title: "We scope your plan together", body: `${ESSENTIALS} are always in. Add only what you’ll use.` },
    { title: "Get one monthly price", body: "Month-to-month, no annual commitment. Setup quoted alongside it." },
  ];
  return (
    <section className={styles.section} aria-labelledby="pricing-proposal-title">
      <div className={`${styles.split} ${styles.splitReverse}`}>
        <div className={styles.picture}><ProposalDemo /></div>
        <div className={styles.copyColumn}>
          <p className={styles.kicker}>Pricing</p>
          <h2 className={styles.title} id="pricing-proposal-title">A quote that fits, in one call.</h2>
          <Audiences />
          <ol className={styles.steps}>
            {steps.map((step, i) => (
              <li key={step.title}>
                <span className={styles.stepNumber}>{i + 1}</span>
                <div><strong>{step.title}</strong><p>{step.body}</p></div>
              </li>
            ))}
          </ol>
          <Cta>Book a quick call</Cta>
          <p className={styles.fine}>Domain registration is not included.</p>
        </div>
      </div>
    </section>
  );
}
