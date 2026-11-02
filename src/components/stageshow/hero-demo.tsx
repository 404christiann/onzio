"use client";

/* eslint-disable @next/next/no-img-element -- The stage scales these with the scene; next/image would fight its transform. */
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Collapse, Field, Phone, Roll, Row, Stage, States, Window, type Act, type Layout } from "@/stageshow/kit";
import { CentralIcon, type CentralIconName } from "@/components/icons/central/icon";
import "./onzio-look.css";
import "./hero-demo.css";

// The whole promise as one tour: the club's real site in a window, and staff
// running it from a phone. Staff publish an announcement and the bar opens on
// the site, then tap through the club's pages and the site follows. It starts
// once most of it is in view, plays through once, comes home and holds; the
// tabs under it go back to any part.

const ANNOUNCEMENT = "Spring tryouts are open";

const CHAPTERS: { label: string; page: string; field: string; value: string; top: number; icon: CentralIconName }[] = [
  { label: "First impression", page: "Homepage", field: "Announcement", value: ANNOUNCEMENT, top: 0, icon: "website" },
  { label: "Club story", page: "About", field: "Headline", value: "Developing the next generation", top: 2145, icon: "staff" },
  { label: "Player pathways", page: "Programs", field: "Headline", value: "A pathway for every player", top: 3927, icon: "competition" },
];

const PAGES = [...CHAPTERS.map(chapter => chapter.page), "Roster", "Schedule", "Store", "Contact"];

type S = { text: string; focus: boolean; publish: "idle" | "busy" | "done"; live: boolean; page: number };
type Scene = { chapter: number; from: number; published: boolean };

const after = (page: number): S => ({ text: CHAPTERS[page].value, focus: false, publish: "done", live: true, page });
const before = (page: number): S => ({ text: "", focus: false, publish: "idle", live: false, page });

// How much of the figure must show before the story starts, so it plays where it can be seen.
const IN_VIEW = 0.7;

function deferred() {
  let resolve = () => {};
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}

async function publishBeats(a: Act<S>) {
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
}

const SIZE: Record<Layout, { phone: number }> = { wide: { phone: 300 }, compact: { phone: 300 } };

export function HeroDemo() {
  // A new scene remounts the stage, so it changes only with the chapter; what
  // moves during a chapter stays out of it, or the stage would restart its script.
  const [scene, setScene] = useState<Scene>({ chapter: 0, from: 0, published: false });
  const [shown, setShown] = useState(0);
  const playing = useRef(true);
  const publishedOnce = useRef(false);
  const [start] = useState(deferred);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = frame.current!;
    const threshold = Math.min(IN_VIEW, (window.innerHeight * 0.8) / element.offsetHeight);
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) start.resolve(); }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [start]);

  const go = (next: number) => {
    const published = publishedOnce.current;
    setScene(current => current.chapter === next ? current : { chapter: next, from: current.chapter, published });
  };

  const select = (next: number) => {
    start.resolve();
    playing.current = false;
    setShown(next);
    go(next);
  };

  const { chapter, from, published } = scene;
  const initial = useMemo(() => published ? after(from) : before(from), [from, published]);
  const poster = useMemo(() => after(chapter), [chapter]);

  const script = useMemo(() => async (a: Act<S>) => {
    await start.promise;
    if (chapter === 0 && !published) {
      await publishBeats(a);
    } else {
      await a.wait(700);
      a.mark("tap");
      await a.click({ at: `page-${chapter}`, x: 0.5, y: 0.5 });
      setShown(chapter);
      a.put(after(chapter));
    }
    publishedOnce.current = true;
    a.mark(`chapter-${chapter}`);
    await a.wait(3400);
    if (playing.current && (chapter !== 0 || !published)) go((chapter + 1) % CHAPTERS.length);
  }, [chapter, published, start]);

  return (
    <div ref={frame} className="hd-frame">
      <div role="img" aria-label={`Illustration: from a phone, staff manage the Diverse City FC website shown in a browser. Now showing: ${CHAPTERS[shown].label}.`}>
        <Stage<S>
          key={chapter}
          width={1000}
          height={560}
          compact={{ below: 660, width: 358, height: 614 }}
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
                <Collapse open={s.live}>
                  <div className="hd-bar">
                    <span>{ANNOUNCEMENT}</span>
                    <b>Register <CentralIcon name="arrow" width={14} height={14} /></b>
                  </div>
                </Collapse>
                <div className="hd-capture" data-crop style={{ "--top": CHAPTERS[s.page].top } as React.CSSProperties}>
                  <img src="/images/club-showcase/homepage-desktop.jpg" alt="" fetchPriority="high" />
                </div>
              </Window>

              <Phone width={SIZE[layout].phone} frame="pro" className="hd-phone">
                <div className="hd-app">
                  <div className="hd-app-head">
                    <img src="/diverse-city-fc-logo.png" alt="" />
                    <div><strong>Diverse City FC</strong><small>Club administration</small></div>
                  </div>
                  <div className="hd-app-title">
                    <strong><Roll variant="fade">{CHAPTERS[s.page].page}</Roll></strong>
                    <span className="hd-live">Live</span>
                  </div>
                  <Field
                    className="hd-field"
                    label={<span className="hd-field-label"><Roll variant="fade">{CHAPTERS[s.page].field}</Roll></span>}
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
                    {PAGES.map((page, index) => (
                      <Row key={page} pad={8} className="hd-page" data-target={index < CHAPTERS.length ? `page-${index}` : undefined} data-on={s.page === index || undefined} title={page}>
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
      <div className="hd-tabs" role="group" aria-label="Site highlights">
        {CHAPTERS.map((item, index) => (
          <button key={item.label} type="button" aria-pressed={shown === index} onClick={() => select(index)}>
            <CentralIcon name={item.icon} width={18} height={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
