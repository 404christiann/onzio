import styles from "./pricing-section.module.css";
import { PlanFeatures } from "@/components/stageshow/pricing-demos";

// No prices: one monthly plan, quoted on a call. The picture shows what every
// plan includes, then what clubs and leagues usually add.

export function PricingSection() {
  return (
    <section className={styles.section} id="pricing" aria-labelledby="pricing-title">
      <div className={styles.layout}>
        <header className={styles.intro}>
          <h2 className={styles.title} id="pricing-title">Pricing</h2>
          <p className={styles.copy}>
            One monthly plan, no contract. Every club starts with the website, hosting, admin, and updates. Add the features you need, for a single club or a whole league. We&apos;ll quote it on a short call, including the one-time website setup.
          </p>
        </header>
        <div className={styles.picture}>
          <div className={styles.wide}><PlanFeatures size="desktop" /></div>
          <div className={styles.phone}><PlanFeatures size="phone" /></div>
        </div>
        <div className={styles.close}>
          <p>Not sure what you need? Tell us about your club or league and we&apos;ll put it together.</p>
          <a className={styles.cta} href="#contact">Book a call</a>
        </div>
      </div>
    </section>
  );
}
