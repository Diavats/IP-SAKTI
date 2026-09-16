"use client";

import * as React from "react";

const SESSION_KEY = "samhita-intro-played";
const FAIL_OPEN_MS = 2000;
const SKIP_VISIBLE_MS = 1000;

// One-time brand intro video, gated to play at most once per browser
// session. Fails open aggressively (video error, or no `playing` event
// within FAIL_OPEN_MS) since this is a decorative asset that must never
// block access to the app.
export function IntroGate() {
  const [visible, setVisible] = React.useState(false);
  const [showSkip, setShowSkip] = React.useState(false);
  const dismissedRef = React.useRef(false);
  const failOpenTimer = React.useRef<number | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    // Client-only "should we show the intro" check, run once on mount.
    // Both the server render and this component's first client render
    // always show nothing (`visible` starts false), so there's no
    // hydration mismatch - this effect is what's allowed to diverge from
    // that shared initial render. Read and write happen once each here;
    // nothing re-reads sessionStorage afterward, so a later unrelated
    // re-render can't flip this back off.
    let eligible = false;
    try {
      eligible = sessionStorage.getItem(SESSION_KEY) !== "1";
    } catch {
      eligible = false;
    }
    if (!eligible) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage unavailable - still safe to show the intro once for this
      // render; just can't persist the "seen" flag across reloads.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate client-only mount gate (see comment above); the value depends on sessionStorage, which cannot be read safely during SSR or in a lazy useState initializer.
    setVisible(true);
  }, []);

  const dismiss = React.useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    if (failOpenTimer.current !== null) {
      window.clearTimeout(failOpenTimer.current);
      failOpenTimer.current = null;
    }
    setVisible(false);
  }, []);

  React.useEffect(() => {
    if (!visible) return;

    const skipTimer = window.setTimeout(() => setShowSkip(true), SKIP_VISIBLE_MS);
    failOpenTimer.current = window.setTimeout(dismiss, FAIL_OPEN_MS);

    function handleKeyDown() {
      dismiss();
    }
    window.addEventListener("keydown", handleKeyDown);

    // Chrome's autoplay gate checks `muted` at the moment the element
    // attaches; React applying it as a JSX prop can lose that race. Setting
    // it imperatively and calling play() directly is the reliable path -
    // if the browser still blocks it, play() rejects and the fail-open
    // timer above takes over.
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }

    return () => {
      window.clearTimeout(skipTimer);
      if (failOpenTimer.current !== null) window.clearTimeout(failOpenTimer.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, dismiss]);

  function handlePlaying() {
    if (failOpenTimer.current !== null) {
      window.clearTimeout(failOpenTimer.current);
      failOpenTimer.current = null;
    }
  }

  if (!visible) return null;

  return (
    <div
      role="button"
      tabIndex={-1}
      aria-label="Skip intro"
      onClick={dismiss}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand"
    >
      <video
        ref={videoRef}
        src="/video/awakening.mp4"
        poster="/video/poster.jpg"
        autoPlay
        muted
        playsInline
        onPlaying={handlePlaying}
        onEnded={dismiss}
        onError={dismiss}
        className="h-full w-full object-cover"
      />
      {showSkip && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          className="absolute bottom-6 right-6 rounded-full bg-black/40 px-4 py-2 text-sm text-on-brand backdrop-blur-sm transition-colors hover:bg-black/55"
        >
          Skip
        </button>
      )}
    </div>
  );
}
