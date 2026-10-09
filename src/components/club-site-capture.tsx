/* eslint-disable @next/next/no-img-element -- Source-pixel captures and original club assets are scaled as one noninteractive surface. */
import { CentralIcon } from "@/components/icons/central/icon";
import styles from "./platform-showcase.module.css";

const VIDEO_BASE = "https://vz-dab9684b-901.b-cdn.net";
const videos = {
  hero: `${VIDEO_BASE}/e49b4657-7396-48d7-b55b-09d38d892c72/play_720p.mp4`,
  reel: `${VIDEO_BASE}/f84f9cbb-4b03-43f8-94f3-33010680533e/play_720p.mp4`,
};

function ClubVideo({ kind, device }: { kind: "hero" | "reel"; device: "mac" | "phone" }) {
  const top = kind === "hero" ? 0 : device === "mac" ? 2144.6875 : 2717;
  const height = kind === "hero" ? device === "mac" ? 747.828125 : 720 : device === "mac" ? 740.078125 : 420;
  return (
    <video
      data-tour-video={kind} data-video-top={top} data-video-height={height}
      src={videos[kind]} poster={`/images/club-showcase/diverse-city-${kind === "hero" ? "hero" : "club-reel"}-poster.jpg`}
      muted loop playsInline preload="none" controls={false} tabIndex={-1}
      disablePictureInPicture disableRemotePlayback aria-hidden="true"
    />
  );
}

export function ClubSiteCapture({ device, layer }: { device: "mac" | "phone"; layer: "a" | "b" }) {
  const phone = device === "phone";
  return (
    <div className={`${styles["page-strip"]} ${layer === "b" ? styles["layer-b"] : ""}`} data-tour-layer={layer} data-capture-device={device}>
      <img className={styles["capture-image"]} data-tour-capture="" src={`/images/club-showcase/homepage-${phone ? "phone" : "desktop"}.jpg`} width={phone ? 375 : 1395} height={phone ? 6914 : 4944} loading="lazy" alt="" draggable={false} />
      <div className={styles["capture-hero"]} data-video-surface="" aria-hidden="true">
        <ClubVideo kind="hero" device={device} />
        <div className={styles["hero-scrim"]} />
        <div className={styles["hero-navigation"]}>
          <img className={styles["hero-crest"]} src="/diverse-city-fc-logo.png" alt="" />
          <span className={styles["hero-divider"]} />
          <img className={styles["hero-us"]} src="/images/club-showcase/us-soccer-white.png" alt="" />
          <img className={styles["hero-fifa"]} src="/images/club-showcase/fifa-white.png" alt="" />
          <img className={styles["hero-upsl"]} src="/images/club-showcase/upsl-white.png" alt="" />
          {phone ? <span className={styles["hero-menu"]}><CentralIcon name="menu" /></span> : (
            <div className={styles["hero-links"]}>{["Home", "About", "Roster", "Schedule", "Programs", "Store", "Contact"].map(text => <span key={text}>{text}</span>)}</div>
          )}
        </div>
        <div className={styles["hero-content"]}>
          <div className={styles["hero-title"]}><span>One Club</span><span>One Community</span></div>
          <p>An inclusive, community-driven soccer club and pro academy developing players of all abilities while creating opportunities on and off the field.</p>
          <div className={styles["hero-ctas"]}><span>Explore Our Programs</span><span>Discover the Club</span></div>
        </div>
      </div>
      {layer === "a" ? <div className={styles["capture-reel"]} data-video-surface="" aria-hidden="true"><ClubVideo kind="reel" device={device} /></div> : null}
    </div>
  );
}
