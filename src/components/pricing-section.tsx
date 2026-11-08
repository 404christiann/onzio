import styles from "./pricing-section.module.css";
import { CentralIcon } from "@/components/icons/central/icon";
import { ClubPlans } from "@/components/stageshow/pricing-demos";

// No monthly figure: plans are scoped to each club, league or tournament.
// The picture shows three organizations on one platform with different plans.

export function PricingSection() {
  return (
    <section className={styles.section} id="pricing" aria-labelledby="pricing-title">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.kicker}>Pricing</p>
          <h2 className={styles.title} id="pricing-title">One platform. A plan for each.</h2>
          <p className={styles.copy}>
            A community club, an academy and a league don&rsquo;t need the same tools, so they shouldn&rsquo;t pay for the same plan.
          </p>
        </div>
        <div className={styles.picture}><ClubPlans /></div>
        <aside className={styles.strip} aria-label="Get a plan for your organization">
          <div className={styles.stripCopy}>
            <p className={styles.stripTitle}>What do you run?</p>
            <p className={styles.stripText}>Tell us about your club, league or tournament and we&rsquo;ll scope a monthly plan in one conversation.</p>
          </div>
          <dl className={styles.terms}>
            <div><dt>Billing</dt><dd>Month-to-month</dd></div>
            <div><dt>Website setup</dt><dd>Quoted separately</dd></div>
            <div><dt>Domain</dt><dd>Not included</dd></div>
          </dl>
          <a className={styles.cta} href="#contact">
            Scope my plan
            <CentralIcon name="arrow" className={styles.ctaIcon} />
          </a>
        </aside>
      </div>
    </section>
  );
}
