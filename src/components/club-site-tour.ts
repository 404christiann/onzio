export const TOUR_DURATION = 32000;
export const chapters = [
  { label: "First impression", copy: "The club’s own identity, on every screen.", mac: 0, phone: 0 },
  { label: "Club story", copy: "The people and purpose behind the club.", mac: 2145, phone: 3141 },
  { label: "Player pathways", copy: "A clear place to find your next step.", mac: 3927, phone: 5570 },
] as const;
const ease = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Source-pixel offsets keep the desktop and independently captured phone in sync.
export function tourFrame(milliseconds: number) {
  const t = (milliseconds % TOUR_DURATION) / 1000;
  let mac = 0, phone = 0, chapter = 0, reset = 0;
  if (t >= 5 && t < 9) {
    const f = ease((t - 5) / 4);
    mac = mix(0, 2145, f); phone = mix(0, 2717, f); chapter = 1;
  } else if (t >= 9 && t < 17) {
    mac = 2145; phone = mix(2717, 3141, (t - 9) / 8); chapter = 1;
  } else if (t >= 17 && t < 21) {
    const f = ease((t - 17) / 4);
    mac = mix(2145, 3927, f); phone = mix(3141, 5138, f); chapter = 2;
  } else if (t >= 21) {
    mac = 3927; phone = mix(5138, 5570, Math.min(1, (t - 21) / 10)); chapter = 2;
    if (t >= 31) { reset = ease(t - 31); if (reset >= .5) chapter = 0; }
  }
  return { mac, phone, chapter, reset, progress: t / 32 };
}

export type TourState = { playing: boolean; reduced: boolean; ready: boolean; failed: boolean; chapter: number; manual: boolean };
export type TourController = { toggle(): void; select(index: number): void; destroy(): void };

export function createClubTour(root: HTMLElement, notify: (state: TourState) => void): TourController {
  const stage = root.querySelector<HTMLElement>("[data-tour-stage]")!;
  const progress = root.querySelector<HTMLElement>("[data-tour-progress]")!;
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = media.matches, playing = !reduced, ready = false, failed = false;
  let inView = false, destroyed = false, manual = false, chapter = 0;
  let elapsed = 0, last: number | null = null, raf: number | null = null;
  const devices = [...root.querySelectorAll<HTMLElement>("[data-tour-device]")].map(art => {
    const layers = [...art.querySelectorAll<HTMLElement>("[data-tour-layer]")];
    const images = [...art.querySelectorAll<HTMLImageElement>("[data-tour-capture]")];
    const videos = layers.flatMap((layer, index) => [...layer.querySelectorAll<HTMLVideoElement>("[data-tour-video]")].map(element => ({
      element, layer: index, top: Number(element.dataset.videoTop), height: Number(element.dataset.videoHeight), desired: false,
    })));
    return { art, name: art.dataset.tourDevice as "mac" | "phone", viewport: layers[0].parentElement!, layers, images, videos, scale: 0, limit: 0, sourceHeight: 0 };
  });
  const publish = () => notify({ playing, reduced, ready, failed, chapter, manual });
  const canRun = () => playing && ready && inView && !document.hidden && !reduced && !destroyed;
  const position = (d: typeof devices[number], layer: HTMLElement, y: number, opacity: number) => {
    layer.style.transform = `translate3d(0,${-Math.min(d.limit, Math.max(0, y)) * d.scale}px,0)`;
    layer.style.opacity = String(opacity);
  };
  const videoCleanups = devices.flatMap(d => d.videos.map(video => {
    const shown = () => { if (!destroyed) video.element.parentElement!.dataset.videoReady = "true"; };
    const failed = () => { delete video.element.parentElement!.dataset.videoReady; };
    video.element.addEventListener("playing", shown);
    video.element.addEventListener("error", failed);
    return () => { video.element.removeEventListener("playing", shown); video.element.removeEventListener("error", failed); };
  }));
  function syncVideos(d: typeof devices[number], y: number, reset: number) {
    const running = canRun() && d.art.getAttribute("aria-hidden") !== "true";
    d.videos.forEach(video => {
      const camera = video.layer === 0 ? Math.min(d.limit, Math.max(0, y)) : 0;
      const opacity = video.layer === 0 ? 1 - reset : reset;
      const desired = running && opacity > .01 && video.top < camera + d.sourceHeight && video.top + video.height > camera;
      if (desired === video.desired) return;
      video.desired = desired;
      if (!desired) { video.element.pause(); return; }
      video.element.muted = true;
      // Muted inline playback needs no interaction. The capture remains the fallback
      // if playback is blocked or the original CDN is temporarily unavailable.
      video.element.play().then(() => {
        if (!video.desired || destroyed) video.element.pause();
      }).catch(() => {});
    });
  }
  function render() {
    if (!ready) return;
    const frame = tourFrame(elapsed);
    const nextChapter = manual || reduced ? chapter : frame.chapter;
    devices.forEach(d => {
      const y = manual || reduced ? chapters[chapter][d.name] : frame[d.name];
      const reset = manual || reduced ? 0 : frame.reset;
      position(d, d.layers[0], y, 1 - reset);
      position(d, d.layers[1], 0, reset);
      syncVideos(d, y, reset);
    });
    progress.style.transform = `scaleX(${manual || reduced ? 0 : frame.progress})`;
    if (nextChapter !== chapter) { chapter = nextChapter; publish(); }
  }
  function tick(now: number) {
    raf = null;
    if (!canRun()) { last = null; return; }
    // Ignore suspension gaps; a resumed tour continues where it paused.
    if (last !== null) elapsed = (elapsed + Math.min(100, now - last)) % TOUR_DURATION;
    last = now;
    render();
    raf = requestAnimationFrame(tick);
  }
  function reconcile() {
    stage.dataset.playback = canRun() ? "playing" : playing ? "waiting" : "paused";
    if (canRun() && raf === null) raf = requestAnimationFrame(tick);
    if (!canRun()) { if (raf !== null) cancelAnimationFrame(raf); raf = null; last = null; }
    render();
  }
  function measure() {
    devices.forEach(d => {
      if (!d.viewport.clientWidth || !d.images[0].naturalWidth) return;
      d.scale = d.viewport.clientWidth / d.images[0].naturalWidth;
      d.sourceHeight = d.viewport.clientHeight / d.scale;
      d.limit = Math.max(0, d.images[0].naturalHeight - d.sourceHeight);
    });
    render();
  }
  const intersection = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .1;
    reconcile();
  }, { threshold: [0, .1] });
  intersection.observe(stage);
  const resize = new ResizeObserver(measure);
  devices.forEach(d => resize.observe(d.viewport));
  function motionChange() {
    reduced = media.matches;
    if (reduced) { playing = false; manual = true; }
    publish(); reconcile(); render();
  }
  media.addEventListener("change", motionChange);
  document.addEventListener("visibilitychange", reconcile);
  // Decoding the source captures avoids an empty screen on the first movement.
  const imageCleanups: (() => void)[] = [];
  const imageReady = (image: HTMLImageElement) => new Promise<void>((resolve, reject) => {
    if (image.complete) {
      if (image.naturalWidth) resolve(); else reject(new Error("Capture failed to load"));
      return;
    }
    const loaded = () => { cleanup(); resolve(); };
    const errored = () => { cleanup(); reject(new Error("Capture failed to load")); };
    const cleanup = () => { image.removeEventListener("load", loaded); image.removeEventListener("error", errored); };
    image.addEventListener("load", loaded);
    image.addEventListener("error", errored);
    imageCleanups.push(cleanup);
  }).then(() => image.decode());
  Promise.all(devices.flatMap(d => d.images.map(imageReady))).then(() => {
    if (destroyed) return;
    ready = true; measure(); publish(); reconcile();
  }).catch(() => {
    if (destroyed) return;
    failed = true; playing = false; publish(); reconcile();
  });
  // Reduced motion is discovered after hydration, before any animation starts.
  publish();
  return {
    toggle() {
      if (!ready || failed || reduced) return;
      if (playing) playing = false;
      else {
        if (manual) { elapsed = 0; manual = false; chapter = 0; render(); }
        playing = true;
      }
      publish(); reconcile();
    },
    select(index) {
      if (index < 0 || index >= chapters.length) return;
      playing = false; manual = true; chapter = index;
      publish(); reconcile(); render();
    },
    destroy() {
      destroyed = true;
      if (raf !== null) cancelAnimationFrame(raf);
      intersection.disconnect(); resize.disconnect();
      imageCleanups.forEach(cleanup => cleanup());
      devices.forEach(d => d.videos.forEach(video => { video.desired = false; video.element.pause(); }));
      videoCleanups.forEach(cleanup => cleanup());
      media.removeEventListener("change", motionChange);
      document.removeEventListener("visibilitychange", reconcile);
    },
  };
}
