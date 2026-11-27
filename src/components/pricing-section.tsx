import styles from "./pricing-section.module.css";
import { CentralIcon } from "@/components/icons/central/icon";

// No prices: every plan is quoted on a call. The cards show what each kind of
// club tends to use on top of what every plan includes.

const PLANS = [
  { name: "Community club", kind: "A few teams, one season", features: ["Tryout sign-ups"] },
  { name: "Multi-program academy", kind: "Several programs, year-round", features: ["Registration & waivers", "Online payments", "Season results"] },
  {
    name: "League or tournament",
    kind: "Many clubs, one schedule",
    features: ["Team registration & waivers", "Online payments", "Schedules & standings", "Tournament brackets", "Club accounts", "Staff accounts"],
  },
];

export function PricingSection() {
  return (
    <section className={styles.section} id="pricing" aria-labelledby="pricing-title">
      <div className={styles.layout}>
        <header className={styles.intro}>
          <h2 className={styles.title} id="pricing-title">Pricing</h2>
          <p className={styles.copy}>
            Every plan is one monthly fee with no contract. All plans include your website, hosting, the admin, and updates. You only pay for the features your club uses. Tell us about your club on a short call and we&apos;ll send a quote, including the one-time website setup.
          </p>
        </header>
        <ul className={styles.cards}>
          {PLANS.map(plan => (
            <li key={plan.name} className={styles.card}>
              <div className={styles.head}>
                <h3>{plan.name}</h3>
                <p>{plan.kind}</p>
              </div>
              <div className={styles.included}>
                <strong>Included in every plan</strong>
                <span>Website · Hosting · Admin · Updates</span>
              </div>
              <div className={styles.features}>
                <p className={styles.label}>Features for this kind of club</p>
                <ul>
                  {plan.features.map(feature => (
                    <li key={feature}><CentralIcon name="check" width={16} height={16} className={styles.check} aria-hidden="true" />{feature}</li>
                  ))}
                </ul>
              </div>
              <p className={styles.foot}>Monthly · quoted on a call</p>
            </li>
          ))}
        </ul>
        <a className={styles.cta} href="#contact">Book a call</a>
      </div>
    </section>
  );
}
