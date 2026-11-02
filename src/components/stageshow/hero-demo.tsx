"use client";

/* eslint-disable @next/next/no-img-element -- The stage scales these with the scene; next/image would fight its transform. */
import { Check, Collapse, Field, Phone, Row, Stage, States, Window, type Act, type Layout } from "@/stageshow/kit";
import { CentralIcon } from "@/components/icons/central/icon";
import "./onzio-look.css";
import "./hero-demo.css";

// The hero promise as one event: staff publish from the admin on a phone and
// the club's public site changes. Beats: an announcement is typed, Publish
// presses, the button confirms on itself, then the bar opens on the website,
// carrying the page down with it. Plays once and holds the result.

type S = { text: string; focus: boolean; publish: "idle" | "busy" | "done"; live: boolean };

const ANNOUNCEMENT = "Spring tryouts are open";
const initial: S = { text: "", focus: false, publish: "idle", live: false };
const poster: S = { text: ANNOUNCEMENT, focus: false, publish: "done", live: true };

async function script(a: Act<S>) {
  await a.wait(900);
  a.mark("type");
  await a.click({ at: "announcement", x: 0.82, y: 0.5 });
  a.put({ focus: true });
  await a.wait(250);
  await a.type("text", ANNOUNCEMENT, { interval: 52 });
  await a.wait(350);
  a.mark("publish");
  await a.click({ at: "publish", x: 0.8, y: 0.5 });
  a.put({ focus: false, publish: "busy" });
  await a.wait(900);
  a.put({ publish: "done" });
  await a.wait(320);
  a.mark("live");
  a.put({ live: true });
  await a.wait(2600);
}

const SIZE: Record<Layout, { phone: number }> = { wide: { phone: 312 }, compact: { phone: 270 } };

export function HeroDemo() {
  return (
    <div role="img" aria-label="Illustration: a staff member publishes an announcement from the Onzio admin on a phone, and it appears on the Diverse City FC website." className="hd-frame">
      <Stage<S>
        width={940}
        height={556}
        compact={{ below: 620, width: 358, height: 358 }}
        initial={initial}
        poster={poster}
        script={script}
        play="once"
        fidelity="realistic"
        cursor={{ at: { at: "publish", x: 0.5, y: 2 }, style: "touch" }}
        className="onzio-look hd"
      >
        {(s, _rect, layout) => (
          <>
            <Window url="diversecityfc.com" className="hd-window" body={{ className: "hd-site", "data-crop": true }}>
              <header className="hd-nav">
                <img src="/diverse-city-fc-logo.png" alt="" />
                <nav>
                  {["Home", "About", "Roster", "Schedule", "Programs"].map((item, index) => <span key={item} data-on={index === 0 || undefined}>{item}</span>)}
                </nav>
              </header>
              <Collapse open={s.live}>
                <div className="hd-bar">
                  <span>{ANNOUNCEMENT}</span>
                  <b>Register <CentralIcon name="arrow" width={14} height={14} /></b>
                </div>
              </Collapse>
              <section className="hd-photo">
                <img src="/images/club-showcase/diverse-city-hero-poster.jpg" alt="" />
                <div>
                  <strong>One club</strong>
                  <strong><em>One community</em></strong>
                  <span className="hd-cta">Explore our programs</span>
                </div>
              </section>
            </Window>

            <Phone width={SIZE[layout].phone} frame="pro" className="hd-phone">
              <div className="hd-app">
                <div className="hd-app-head">
                  <img src="/diverse-city-fc-logo.png" alt="" />
                  <div><strong>Diverse City FC</strong><small>Club administration</small></div>
                </div>
                <div className="hd-app-title">
                  <strong>Homepage</strong>
                  <span className="hd-live">Live</span>
                </div>
                <Field
                  className="hd-field"
                  label={<span className="hd-field-label">Announcement</span>}
                  value={s.text}
                  focused={s.focus}
                  placeholder="Tell your community"
                  box={{ "data-target": "announcement" }}
                />
                <span className="hd-publish" data-target="publish" data-done={s.publish === "done" || undefined}>
                  <States
                    value={s.publish}
                    states={{
                      idle: <span className="hd-publish-label">Publish</span>,
                      busy: <span className="hd-publish-label"><Check on={false} pending size={16} />Publishing</span>,
                      done: <span className="hd-publish-label"><Check on size={16} />Published</span>,
                    }}
                  />
                </span>
                <div className="hd-pages">
                  <span className="hd-pages-label">Pages</span>
                  {["Programs", "Tryouts", "Roster", "Schedule", "Sponsors"].map(page => (
                    <Row key={page} pad={8} className="hd-page" title={page}>
                      <CentralIcon name="chevron-right" width={15} height={15} />
                    </Row>
                  ))}
                </div>
              </div>
            </Phone>
          </>
        )}
      </Stage>
    </div>
  );
}
