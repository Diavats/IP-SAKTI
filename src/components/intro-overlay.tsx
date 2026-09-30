"use client";

import * as React from "react";

// Phase 1: the brand video, full screen, nothing else.
//
// A fixed overlay rather than a tall section on the page, because the brief is
// that the visitor cannot scroll at all while this is running. A section can be
// scrolled past; a fixed layer with the body locked cannot.
//
// It ends on whichever comes first: the video finishing, the visitor pressing
// Skip, Escape, or a hard backstop. Then it unmounts and phase 2 (the app, with
// the same video looping behind the top of the page) is underneath, already
// rendered.
//
// Plays at most once per session. Without that, every navigation back to the
// home route replays 18 seconds, which would be unusable during a live demo.

const SESSION_KEY = "samhita.intro.seen";
const SKIP_AFTER_MS = 1200;
const HARD_STOP_MS = 21_000; // video is 18.2s; backstop only.

export function IntroOverlay({ onDone }: { onDone: () => void }) {
  const [showSkip, setShowSkip] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const doneRef = React.useRef(false);

  const finish = React.useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage blocked. The intro simply plays again next navigation.
    }
    onDone();
  }, [onDone]);

  React.useEffect(() => {
    // Lock the page while the intro owns the screen.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const skipTimer = window.setTimeout(() => setShowSkip(true), SKIP_AFTER_MS);
    const hardTimer = window.setTimeout(finish, HARD_STOP_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);

    // Chrome checks `muted` at attach time and React setting it as a JSX prop
    // can lose that race, so set it imperatively before asking to play. If the
    // browser refuses, play() rejects and we skip straight to the app.
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(finish);
    }

    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(skipTimer);
      window.clearTimeout(hardTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish]);

  return (
    <div className="fixed inset-0 z-[100] bg-brand" role="dialog" aria-label="Introduction">
      {/* The letterbox. object-contain on a taller-than-wide source always
          leaves bars; rather than flat brand green they carry the same dotted
          gradient the page uses, so the intro reads as part of the product
          instead of a video dropped on a colour field. Static CSS layers, no
          canvas — §9 is explicit about not adding another running canvas. */}
      <div className="absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 40%, #14523c 0%, #0f3d2e 55%, #0a2a20 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.5,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(16,121,79,0.55) 1px, transparent 0)",
            backgroundSize: "4px 4px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.32,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
            backgroundSize: "9px 9px",
            backgroundPosition: "2px 3px",
          }}
        />
      </div>

      {/* Cropped to 1280x1200 (crop=1280:1200:0:420), not the raw 1280x1920.
          The master's dead space sits above the sun and below the hand, so
          trimming it makes the video substantially wider on screen while every
          element — hand, logo, wordmark, tagline — stays in frame. Verified by
          inspecting frames at t=6 and t=16.
          object-contain, never cover: cover would crop what this crop was
          chosen to preserve. */}
      <video
        ref={videoRef}
        src="/video/awakening-intro.mp4"
        poster="/video/poster-intro.jpg"
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
        aria-hidden
        className="relative size-full object-contain"
      />

      {showSkip && (
        <button
          type="button"
          onClick={finish}
          className="absolute right-5 top-5 z-10 rounded-full border border-white/30 bg-black/45 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Skip intro
        </button>
      )}
    </div>
  );
}

/** Whether the intro has already run this session. Safe during SSR. */
export function introAlreadySeen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return true;
  } catch {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
