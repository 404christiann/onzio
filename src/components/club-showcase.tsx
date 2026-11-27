/* eslint-disable @next/next/no-img-element -- A fixed-size crest and capture inside one link. */
import { AdminIcon } from "@/components/stageshow/admin-icons";
import "./club-showcase.css";

// One link to Rose City FC's live site, the club whose admin the tour above shows.
export function ClubShowcase() {
  return (
    <section className="cs-section" id="club-sites" aria-labelledby="club-sites-title">
      <div className="shell">
        <h2 id="club-sites-title" className="cs-sr">Club sites</h2>
        <a className="cs-link" href="https://rosecityfutbolclub.com/" target="_blank" rel="noopener">
          <span className="cs-copy">
            <span className="cs-club">
              <img src="/images/rose-city/crest.webp" width={48} height={48} alt="" />
              <span>Rose City FC · UPSL · Pasadena</span>
            </span>
            <span className="cs-domain">
              rosecityfutbolclub.com
              <AdminIcon name="ExternalLink" size={28} className="cs-arrow" />
            </span>
            <span className="cs-line">Rose City FC runs its site on Onzio. Staff edit everything on it from the same admin.</span>
          </span>
          <span className="cs-shot" aria-hidden="true">
            <img src="/images/rose-city/home-desktop-top.webp" width={1280} height={715} alt="" loading="lazy" decoding="async" />
          </span>
        </a>
      </div>
    </section>
  );
}
