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
      {/* FULL portrait source with object-CONTAIN, not the 16:9 crop with
          object-cover.
          The master is 1280x1920 and awakening-wide.mp4 is its centre band
          (crop=1280:720:0:600), which throws away the top and bottom 600px —
          precisely where the hand and the VedaNova mark are. Cover would crop
          again on top of that. Contain guarantees the entire frame is on
          screen, letterboxed against the brand colour, which is the whole
          point of an intro: nothing of it is hidden and nothing needs
          scrolling to reach. */}
      <video
        ref={videoRef}
        src="/video/awakening.mp4"
        poster="/video/poster.jpg"
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
        aria-hidden
        className="size-full object-contain"
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
