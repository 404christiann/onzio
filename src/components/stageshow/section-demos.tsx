"use client";

/* eslint-disable @next/next/no-img-element -- The stage scales these with the scene; next/image would fight its transform. */
import { Badge, Bar, Check, Collapse, Connector, Icon, LockScreen, Notification, Phone, Roll, Stage, type Act } from "@/stageshow/kit";
import "./onzio-look.css";
import "./section-demos.css";

/* ---- Pricing: month-to-month, as a pile of paper ---- */

type BillState = { paid: boolean };

async function billScript(a: Act<BillState>) {
  await a.wait(1100);
  a.put({ paid: true });
  await a.wait(1500);
}

export function InvoiceStack() {
  return (
    <div role="img" aria-label="Illustration: a stack of monthly Onzio invoices, the newest paid.">
      <Stage<BillState> width={440} height={420} compact={{ below: 400, width: 342, height: 330 }} initial={{ paid: false }} poster={{ paid: true }} script={billScript} play="once" className="onzio-look ib">
        {s => (
          <div className="ib-pile">
            <section className="ib-paper ib-back" />
            <section className="ib-paper ib-mid"><Bar w={96} h={7} tone={3} /><Bar w={60} h={7} tone={2} /></section>
            <section className="ib-paper ib-top">
              <div className="ib-head">
                <span className="ib-logo" data-crop><img src="/onzio-logo.png" alt="Onzio" /></span>
                <Badge tone={s.paid ? "success" : "neutral"}><Roll variant="fade">{s.paid ? "Paid" : "Due"}</Roll></Badge>
              </div>
              <div className="ib-month">November</div>
              <div className="ib-line"><span>Onzio managed platform</span><span>$65.00</span></div>
              <div className="ib-line ib-faint"><span>Billing</span><span>Month-to-month</span></div>
              <div className="ib-total"><span>This month</span><strong>$65.00</strong></div>
            </section>
          </div>
        )}
      </Stage>
    </div>
  );
}

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
    <FaqPicture label="The monthly subscription includes the website, hosting, admin portal, and updates. Setup and the domain are separate.">
      <div className="fp-card">
        <div className="fp-line"><span>Subscription</span><span>From $65 / month</span></div>
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

/* ---- Contact: the inquiry lands on a real person's phone ---- */

type InquiryState = { line: boolean; arrived: boolean };

async function inquiryScript(a: Act<InquiryState>) {
  await a.wait(800);
  a.mark("sent");
  if (a.layout === "wide") {
    a.put({ line: true });
    await a.wait(1000);
  }
  a.mark("arrive");
  a.put({ arrived: true });
  await a.wait(2600);
}

const SUMMARY = [["Name", "Jamie Rivera"], ["Email", "jamie@diversecityfc.com"], ["Phone", "(555) 123-4567"], ["Interested in", "Replacing our current club website"]];
const WALL = "linear-gradient(180deg, #0b4d2c, #07351f)";

export function InquiryPhone() {
  return (
    <div role="img" aria-label="Illustration: a sent inquiry arrives as a notification on a phone.">
      <Stage<InquiryState> width={680} height={380} compact={{ below: 500, width: 342, height: 380 }} initial={{ line: false, arrived: false }} poster={{ line: true, arrived: true }} script={inquiryScript} play="once" className="onzio-look onzio-panel iq">
        {(s, rect, layout) => {
          const note = rect("phone");
          const y = 292;
          return (
            <>
              <div className="iq-sent" data-target="sent">
                <div className="iq-sent-head"><Check on size={15} />Inquiry sent</div>
                {layout === "wide" && SUMMARY.map(([label, value]) => (
                  <div className="iq-sent-field" key={label}><span>{label}</span><strong>{value}</strong></div>
                ))}
              </div>
              {layout === "wide" && <Connector route="straight" show={s.line} from={{ x: 280, y }} to={{ x: note.x + 26, y }} />}
              <Phone width={layout === "wide" ? 340 : 294} frame="pro" dark wallpaper={WALL} className="iq-phone" data-target="phone">
                <LockScreen date="Sunday, November 1" stack="top" controls={false}>
                  <Collapse open={s.arrived} reveal="drop">
                    <Notification icon={<Icon name="mail" filled size={20} />} title="New club inquiry" body="Diverse City FC wants to talk" />
                  </Collapse>
                </LockScreen>
              </Phone>
            </>
          );
        }}
      </Stage>
    </div>
  );
}
