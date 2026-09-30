"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDown, Eye, Sparkles } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { getPrahariAlerts } from "@/lib/api";
import { useT } from "@/lib/i18n";

// Full-viewport landing hero with a cinematic open.
//
// Sequence: the brand video plays once, full-bleed and unobstructed. When it
// ends, the landing content irises open from the centre — reading as though
// the hand in the video pressed something — and the video keeps looping behind
// it as a background.
//
// Everything about this is built to FAIL OPEN. An 18-second video is a long
// time to hold someone who just clicked a link, so: the reveal also fires on a
// hard timer if `ended` never arrives, a skip appears after 1.5s, reduced
// motion goes straight to the revealed state, and the intro plays at most once
// per session so returning to home is instant.
const SESSION_KEY = "samhita.intro.seen";
const SKIP_AFTER_MS = 1500;
const HARD_REVEAL_MS = 21_000; // video is 18.2s; this is the backstop, not the plan.

export function Hero() {
  const t = useT();
  const [closingSoon, setClosingSoon] = React.useState<number | null>(null);
  const [revealed, setRevealed] = React.useState(false);
  const [showSkip, setShowSkip] = React.useState(false);
  const [wide, setWide] = React.useState<boolean | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const revealedRef = React.useRef(false);

  const reveal = React.useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage blocked. The intro simply plays again next navigation.
    }
    // Hand over to the looping background.
    const v = videoRef.current;
    if (v) {
      v.loop = true;
      v.play().catch(() => {});
    }
  }, []);

  // Decide, once on mount, whether this visit gets the intro at all.
  React.useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      revealedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only gate: depends on sessionStorage and a media query, neither readable during SSR or in a lazy initializer.
      setRevealed(true);
      return;
    }
    const skipTimer = window.setTimeout(() => setShowSkip(true), SKIP_AFTER_MS);
    const hardTimer = window.setTimeout(reveal, HARD_REVEAL_MS);
    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(hardTimer);
    };
  }, [reveal]);

  // The source is portrait (1280x1920). In a landscape hero, object-cover on a
  // portrait file discards most of the frame AND upscales the narrow width to
  // fill. So there are two encodes: a 16:9 centre crop for landscape, and the
  // full portrait for phones, where portrait is the right shape anyway.
  // Chosen in JS rather than <source media=...>, which browsers evaluate
  // inconsistently inside <video>, so only the needed file is ever fetched.
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    // Chrome checks `muted` at attach time and React setting it as a JSX prop
    // can lose that race, so set it imperatively before asking to play. If the
    // browser refuses anyway, play() rejects and the hard timer reveals.
    const v = videoRef.current;
    if (!v || wide === null) return;
    v.muted = true;
    v.play().catch(() => reveal());
  }, [wide, reveal]);

  React.useEffect(() => {
    getPrahariAlerts().then((alerts) => {
      setClosingSoon(alerts.filter((a) => a.daysRemaining >= 0 && a.daysRemaining < 30).length);
    });
  }, []);

  const videoSrc = wide ? "/video/awakening-wide.mp4" : "/video/awakening.mp4";
  const posterSrc = wide ? "/video/poster-wide.jpg" : "/video/poster.jpg";

  return (
    <section className="relative -mx-4 flex min-h-[100svh] flex-col justify-center overflow-hidden md:-mx-8">
      {wide !== null && (
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          muted
          playsInline
          preload="auto"
          onEnded={reveal}
          onError={reveal}
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {/* Scrim. Absent while the video plays so nothing dims the intro, then
          fades in with the reveal to carry text contrast. Two stops rather than
          a flat wash: body copy has to clear 4.5:1 against the brightest frame. */}
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-[1200ms] ease-out motion-reduce:transition-none"
        style={{
          opacity: revealed ? 1 : 0,
          background:
            "linear-gradient(180deg, rgba(15,61,46,0.72) 0%, rgba(15,61,46,0.58) 38%, rgba(15,61,46,0.88) 100%)",
        }}
      />

      {/* The iris. clip-path animates from a zero-radius circle at the centre
          out past the corners, so the page appears to be pushed open from the
          middle rather than fading in. `visibility` keeps it out of the a11y
          tree and out of tab order until it is actually there. */}
      <div
        className={
          revealed ? "hero-iris hero-iris-open" : "hero-iris hero-iris-closed"
        }
        aria-hidden={!revealed || undefined}
      >
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-20 text-center md:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/75">
            Ministry of AYUSH · All India Institute of Ayurveda
          </p>

          <h1 className="mt-5 font-heading text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
            SAMHITĀ <span className="text-[color:var(--accent)]">संहिता</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-white/90 md:text-xl">
            Applications over Indian traditional knowledge publish every Friday.
            From that day, <span className="font-medium text-white">Rule 55(1A)</span>{" "}
            gives six months to object.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-white/80">
            Before grant, stopping a bad patent costs a form. After grant it costs
            a lawsuit. We count the days.
          </p>

          {/* Live, derived from the same window arithmetic the product runs on. */}
          {closingSoon !== null && closingSoon > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--destructive)]/50 bg-[color:var(--destructive)]/25 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
                <span
                  className="size-2 animate-pulse rounded-full bg-[color:var(--destructive)] motion-reduce:animate-none"
                  aria-hidden
                />
                {closingSoon} objection {closingSoon === 1 ? "window" : "windows"}{" "}
                closing within 30 days
              </span>
            </div>
          )}

          {/* Glass, not the shader button: CLAUDE.md §9 allows exactly one
              LiquidMetalButton in the app and it is on the dashboard below. */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GlassButton asChild variant="onGlass" size="lg">
              <Link href="/?chat=1">
                <Sparkles className="size-4" aria-hidden />
                {t("Ask Sahayak")}
              </Link>
            </GlassButton>
            <GlassButton asChild variant="onGlass" size="lg">
              <Link href="/prahari">
                <Eye className="size-4" aria-hidden />
                {t("See the watchtower")}
              </Link>
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Skip. Present only during the intro, because nobody should be trapped
          in an 18-second video on their way to a product. */}
      {!revealed && showSkip && (
        <button
          type="button"
          onClick={reveal}
          className="absolute bottom-6 right-6 z-20 rounded-full border border-white/25 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Skip intro
        </button>
      )}

      {revealed && (
        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
          <ArrowDown className="animate-hero-cue size-5 text-white" aria-hidden />
        </div>
      )}
    </section>
  );
}
