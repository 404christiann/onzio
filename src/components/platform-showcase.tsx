"use client";

/* eslint-disable @next/next/no-img-element -- Original capture dimensions and hardware silhouettes are used for precise screen compositing. */
import { useEffect, useRef, useState } from "react";
import { ClubSiteCapture } from "./club-site-capture";
import { CentralIcon } from "@/components/icons/central/icon";
import { chapters, createClubTour, type TourController, type TourState } from "./club-site-tour";
import styles from "./platform-showcase.module.css";

const cn = (...names: string[]) => names.map(name => styles[name]).join(" ");

export function PlatformShowcase() {
  const rootRef = useRef<HTMLElement>(null);
  const controller = useRef<TourController | null>(null);
  const [view, setView] = useState<"both" | "desktop" | "phone">("both");
  const [state, setState] = useState<TourState>({ playing: true, reduced: false, ready: false, failed: false, chapter: 0, manual: false });
  const { playing, reduced, ready, failed, chapter, manual } = state;
  const playLabel = playing ? "Pause tour" : manual ? "Replay tour" : "Play tour";
  useEffect(() => {
    const tour = createClubTour(rootRef.current!, setState);
    controller.current = tour;
    return () => { tour.destroy(); controller.current = null; };
  }, []);
  return (
    <section ref={rootRef} id="club-sites" className={cn("root")} aria-labelledby="club-sites-title">
      <div className={cn("shell")}>
        <header className={cn("section-head")}>
        <h2 id="club-sites-title">A public home shaped<br />around the club.</h2>
        <p>Your identity. Your people. Your community.<br />A club website with a character of its own.</p>
        </header>
        <div className={cn("showcase-heading")}>
        <div className={cn("club-id")}>
        <img src="/diverse-city-fc-logo.png" width={54} height={54} loading="lazy" alt="Diverse City FC crest" />
        <div>
        <h3>Diverse City FC</h3>
        <p>Chicago, Illinois</p>
        </div>
        </div>
        <div className={cn("showcase-actions")}>
        <div className={cn("device-switch")} role="group" aria-label="Choose a device view">
        <button type="button" data-device="both" aria-pressed={view === "both"} onClick={() => setView("both")}>Together</button>
        <button type="button" data-device="desktop" aria-pressed={view === "desktop"} onClick={() => setView("desktop")}>
        <CentralIcon name="desktop" /> MacBook</button>
        <button type="button" data-device="phone" aria-pressed={view === "phone"} onClick={() => setView("phone")}>
        <CentralIcon name="phone" /> iPhone</button>
        </div>
        <button className={cn("tour-play")} type="button" data-tour-play="" data-state={playing ? "playing" : "paused"} aria-label={playLabel} hidden={reduced} disabled={!ready || failed} onClick={() => controller.current?.toggle()}>
        <span className={cn("play-symbol")}>
        <span className={cn("play-icon")}>
        <CentralIcon name="play" />
        </span>
        <span className={cn("pause-icon")}>
        <CentralIcon name="pause" />
        </span>
        </span>
        <span className={cn("play-label")}>{playLabel}</span>
        </button>
        </div>
        </div>
        <div className={cn("stage")} data-mode={view} data-tour-stage="">
        <div className={cn("device-art","mac-art")} role="img" data-tour-device="mac" aria-hidden={view === "phone"} aria-label={`MacBook Pro showing a noninteractive homepage capture: ${chapters[chapter].label}`}>
        <div className={cn("screen-window")}>
        <div className={cn("page-viewport")}>
        <ClubSiteCapture device="mac" layer="a" />
        <ClubSiteCapture device="mac" layer="b" />
        </div>
        </div>
        <img className={cn("hardware-frame")} src="/images/club-showcase/macbook-pro-16.png" width={4893} height={3164} loading="lazy" alt="" draggable={false} />
        </div>
        <div className={cn("device-art","phone-art")} role="img" data-tour-device="phone" aria-hidden={view === "desktop"} aria-label={`iPhone showing a noninteractive homepage capture: ${chapters[chapter].label}`}>
        <div className={cn("screen-window")}>
        <div className={cn("phone-status")} aria-hidden="true">
        <span className={cn("phone-time")}>9:41</span>
        <span className={cn("phone-signals")}>
        <i className={cn("cellular")}>
        </i>
        <CentralIcon name="wifi" />
        <CentralIcon name="battery" />
        </span>
        </div>
        <div className={cn("page-viewport")}>
        <ClubSiteCapture device="phone" layer="a" />
        <ClubSiteCapture device="phone" layer="b" />
        </div>
        <div className={cn("safari-dock")} aria-hidden="true">
        <div className={cn("address-pill")}>
        <span className={cn("address-settings")}>aA</span>
        <span className={cn("address-domain")}>
        <CentralIcon name="round-lock" /> diversecityfc.com</span>
        <span className={cn("address-refresh")}>↻</span>
        </div>
        <div className={cn("safari-actions")}>
        <CentralIcon name="chevron-left" />
        <span className={cn("safari-disabled")}>
        <CentralIcon name="chevron-right" />
        </span>
        <CentralIcon name="share" />
        <CentralIcon name="book" />
        <CentralIcon name="tabs" />
        </div>
        <i className={cn("safari-home")}>
        </i>
        </div>
        </div>
        <img className={cn("hardware-frame")} src="/images/club-showcase/iphone-16-pro.png" width={1508} height={3279} loading="lazy" alt="" draggable={false} />
        </div>
        <div className={cn("stage-copy")}>
        <h3>One identity.<br />Every screen.</h3>
        <p>The club comes through on a laptop, in the stands, and on the way to training.</p>
        </div>
        </div>
        <div className={cn("tour-bar")}>
        <div className={cn("chapter-buttons")} role="group" aria-label="Homepage highlights">
        <button className={cn("chapter-button")} type="button" data-chapter="0" aria-pressed={chapter === 0} onClick={() => controller.current?.select(0)}>
        <CentralIcon name="website" />
        <span>First impression</span>
        </button>
        <button className={cn("chapter-button")} type="button" data-chapter="1" aria-pressed={chapter === 1} onClick={() => controller.current?.select(1)}>
        <CentralIcon name="staff" />
        <span>Club story</span>
        </button>
        <button className={cn("chapter-button")} type="button" data-chapter="2" aria-pressed={chapter === 2} onClick={() => controller.current?.select(2)}>
        <CentralIcon name="competition" />
        <span>Player pathways</span>
        </button>
        </div>
        </div>
        <div className={cn("tour-progress")} aria-hidden="true">
        <span data-tour-progress="" />
        </div>
        <div className={cn("device-note")}>
        <p>{chapters[chapter].label} · {chapters[chapter].copy}</p>
        <span>
        <CentralIcon name="website" /> Selected views of the real club website</span>
        </div>
        <footer className={cn("section-foot")}>
        <span>Designed around the club. Managed with Onzio.</span>
        <span>Diverse City FC</span>
        </footer>
        <p className={cn("sr-only")} role="status">{failed ? "The homepage previews could not load. Refresh to try again." : manual ? `${chapters[chapter].label} selected. Tour paused.` : ""}</p>
      </div>
    </section>
  );
}
