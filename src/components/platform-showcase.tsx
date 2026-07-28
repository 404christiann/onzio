"use client";

import { useEffect, useRef, useState } from "react";

const roseCityUrl = "https://rosecityfutbolclub.com/";

type PlatformSurface = "website" | "admin";

export function PlatformShowcase() {
  const [surface, setSurface] = useState<PlatformSurface>("website");
  const videoRef = useRef<HTMLVideoElement>(null);
  const isWebsite = surface === "website";

  useEffect(() => {
    if (surface !== "admin" || !videoRef.current) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      const video = videoRef.current;
      if (!video) return;

      if (motionPreference.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {
          // Native controls remain available if autoplay is blocked.
        });
      }
    };

    syncPlayback();
    motionPreference.addEventListener("change", syncPlayback);
    return () => motionPreference.removeEventListener("change", syncPlayback);
  }, [surface]);

  return (
    <>
      <div className="showcase-switcher" role="group" aria-label="Choose a Rose City platform view">
        <button
          className="showcase-tab"
          type="button"
          aria-pressed={isWebsite}
          onClick={() => setSurface("website")}
        >
          Public website
        </button>
        <button
          className="showcase-tab"
          type="button"
          aria-pressed={!isWebsite}
          onClick={() => setSurface("admin")}
        >
          Admin platform
        </button>
      </div>

      <div
        className={`browser-frame${isWebsite ? "" : " browser-frame-admin"}`}
        id="platform-panel"
        role="region"
        aria-label={isWebsite ? "Rose City public website preview" : "Rose City admin platform preview"}
      >
        <div className="browser-toolbar" aria-hidden="true">
          <div className="browser-dots"><span /><span /><span /></div>
          <div className="browser-address">
            {isWebsite ? "rosecityfutbolclub.com" : "Private club workspace"}
          </div>
          <div className="browser-spacer" />
        </div>

        {isWebsite ? (
          <iframe src={roseCityUrl} title="Live preview of the Rose City FC website" loading="lazy" />
        ) : (
          <video
            ref={videoRef}
            src="/media/rose-city-admin-demo.mp4"
            poster="/media/rose-city-admin-poster.jpg"
            aria-label="Rose City FC private admin platform walkthrough"
            muted
            loop
            playsInline
            controls
            preload="metadata"
          >
            Your browser does not support embedded video.
          </video>
        )}
      </div>

      <div className="case-caption" aria-live="polite">
        {isWebsite ? (
          <>
            <p><strong>A complete digital home</strong> for a semi-professional soccer club.</p>
            <p>Supporter experience</p>
          </>
        ) : (
          <>
            <p><strong>A private operating platform</strong> for the people running the club.</p>
            <p>Protected club access</p>
          </>
        )}
      </div>
    </>
  );
}
