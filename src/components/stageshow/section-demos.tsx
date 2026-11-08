"use client";

import { Badge, Stage } from "@/stageshow/kit";
import "./onzio-look.css";
import "./section-demos.css";

/* ---- FAQ: one picture for each topic ---- */

function FaqPicture({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="img" aria-label={label} className="fp-frame">
      <Stage width={290} height={190} fill className="onzio-look onzio-panel fp">
        {() => children}
      </Stage>
    </div>
  );
}

export function CostsPicture() {
  return (
    <FaqPicture label="Every plan includes the website, hosting, admin portal, and updates, and is scoped to what you need. Setup and the domain are separate.">
      <div className="fp-card">
        <div className="fp-line"><span>Monthly plan</span><span>Scoped to you</span></div>
        <div className="fp-line fp-faint"><span>Website setup</span><span>Quoted separately</span></div>
        <div className="fp-line fp-faint"><span>Domain</span><span>Not included</span></div>
      </div>
    </FaqPicture>
  );
}

export function WebsitePicture() {
  const pages = ["Homepage", "Programs", "Tryouts", "Roster", "Schedule", "Results", "Sponsors"];
  return (
    <FaqPicture label="Staff can update the homepage, programs, tryouts, roster, schedule, results, and sponsors.">
      <div className="fp-chips">
        {pages.map(page => <span key={page}>{page}</span>)}
      </div>
    </FaqPicture>
  );
}

export function RegistrationPicture() {
  return (
    <FaqPicture label="A player registration with the waiver signed and the payment taken through Stripe.">
      <div className="fp-card">
        <div className="fp-line fp-strong"><span>U14 registration</span><Badge tone="success">Paid</Badge></div>
        <div className="fp-line fp-faint"><span>Waiver</span><span>Signed</span></div>
        <div className="fp-line fp-faint"><span>Payment</span><span>Through Stripe</span></div>
      </div>
    </FaqPicture>
  );
}
