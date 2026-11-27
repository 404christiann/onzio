import styles from "./pricing-section.module.css";
import { ClubPlans } from "@/components/stageshow/pricing-demos";

// No monthly figure: plans are scoped to each club, league or tournament.
// The picture shows three organizations on one platform with different plans.

export function PricingSection() {
  return (
    <section className={styles.section} id="pricing" aria-labelledby="pricing-title">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <h2 className={styles.title} id="pricing-title">Pricing</h2>
          <p className={styles.copy}>Monthly, no contract. Website setup and domains are quoted separately on a short call.</p>
          <a className={styles.cta} href="#contact">Book a call</a>
        </div>
        <div className={styles.picture}><ClubPlans /></div>
      </div>
    </section>
  );
}
