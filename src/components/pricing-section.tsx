import styles from "./pricing-section.module.css";

const inclusions = [
  "Professional club website",
  "Hosting",
  "Admin portal",
  "Platform updates",
];

export function PricingSection() {
  return (
    <section className={styles.section} id="pricing" aria-labelledby="pricing-title">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <h2 className={styles.title} id="pricing-title">
            A professional platform without the agency overhead.
          </h2>
          <p className={styles.copy}>
            Start with the essentials your club needs today, on a month-to-month subscription that can grow with you.
          </p>
        </div>

        <article className={styles.card} aria-label="Onzio managed platform pricing">
          <div className={styles.band}>
            <span>Onzio managed platform</span>
            <span className={styles.bandDetail}>Month-to-month</span>
          </div>
          <div className={styles.body}>
            <p className={styles.starting}>Starting at</p>
            <p className={styles.price}>
              <strong>$65</strong><span>/ month</span>
            </p>
            <p className={styles.commitment}>Month-to-month. No annual commitment.</p>
            <a className={styles.action} href="#contact">
              Get started <span className={`${styles.icon} ${styles.arrow}`} aria-hidden="true" />
            </a>
            <div className={styles.included}>
              <p>Every subscription includes</p>
              <ul>
                {inclusions.map((item) => (
                  <li key={item}>
                    <span className={`${styles.icon} ${styles.check}`} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <footer className={styles.footer}>
            <p>Initial website setup is quoted separately.<br />Domain registration is not included.</p>
          </footer>
        </article>
      </div>
    </section>
  );
}
