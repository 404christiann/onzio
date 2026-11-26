/* eslint-disable @next/next/no-img-element -- Fixed-size captures inside device frames; next/image's wrapper fights the crop. */
import styles from "./club-showcase.module.css";

const pages = [
  { title: "Tickets", copy: "The next home match, kickoff and venue, with a link to buy." },
  { title: "Schedule", copy: "Every fixture and result, filled in from the admin's schedule." },
  { title: "Shop and sponsors", copy: "Kits, merchandise and partner pages the club edits itself." },
  { title: "Match video", copy: "Replays and the club's own series, on its own site." },
];

export function ClubShowcase() {
  return (
    <section className={styles.section} id="club-sites" aria-labelledby="club-sites-title">
      <div className="shell">
        <header className={styles.header}>
          <p className={styles.breadcrumb}>Club sites</p>
          <h2 id="club-sites-title" className={styles.title}>Rose City FC runs its site on Onzio.</h2>
          <p className={styles.description}>
            A UPSL club in Pasadena. Everything below is their live site, edited by club staff from the same admin.
          </p>
        </header>

        <div className={styles.figure}>
          <figure className={styles.desktop}>
            <div className={styles.bar} aria-hidden="true">
              <span className={styles.dots}><i /><i /><i /></span>
              <span className={styles.url}>rosecityfutbolclub.com/schedule</span>
            </div>
            <img src="/images/rose-city/schedule-desktop.webp" width={1280} height={1470} loading="lazy" decoding="async" alt="Rose City FC's schedule page: the next home match against TFT FC, then results against Montclair FC, AYSD D1 and AMSQ FC." />
          </figure>
          <figure className={styles.phone}>
            <img src="/images/rose-city/home-phone.webp" width={780} height={4572} loading="lazy" decoding="async" alt="Rose City FC's homepage on a phone: the crest, the hero, and the next home match card." />
          </figure>
        </div>

        <dl className={styles.pages}>
          {pages.map(page => (
            <div key={page.title}>
              <dt>{page.title}</dt>
              <dd>{page.copy}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.visit}>
          <a href="https://rosecityfutbolclub.com/" rel="noopener" target="_blank">Visit rosecityfutbolclub.com</a>
        </p>
      </div>
    </section>
  );
}
