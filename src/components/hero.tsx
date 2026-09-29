"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDown, Eye, Sparkles } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { getPrahariAlerts } from "@/lib/api";

// Full-viewport landing hero.
//
// This replaces the old IntroGate, which played the same video as a modal you
// had to sit through or dismiss. A gate costs every visitor a beat before they
// see anything, and the gate already had to "fail open" after 2s, which was an
// admission that blocking on a decorative asset is a risk. Here the video is
// the background instead: nothing to dismiss, nothing to wait for, and if it
// never loads the poster frame carries the same composition.
//
// Height is 100svh, not 100vh: on mobile Safari and Chrome, vh includes the
// area under the collapsing URL bar, so a 100vh hero is always slightly taller
// than the screen and forces exactly the scroll this is meant to avoid.
export function Hero() {
  const [closingSoon, setClosingSoon] = React.useState<number | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    getPrahariAlerts().then((alerts) => {
      setClosingSoon(alerts.filter((a) => a.daysRemaining >= 0 && a.daysRemaining < 30).length);
    });
  }, []);

  React.useEffect(() => {
    // Chrome checks `muted` at attach time and React setting it as a JSX prop
    // can lose that race, so set it imperatively before asking to play. If the
    // browser still refuses, the poster frame is already visible underneath.
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="relative -mx-4 flex min-h-[100svh] flex-col justify-center overflow-hidden md:-mx-8">
      {/* Background layer */}
      <video
        ref={videoRef}
        src="/video/awakening.mp4"
        poster="/video/poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 size-full object-cover motion-reduce:hidden"
      />
      {/* Poster stands in when motion is reduced, so the composition survives. */}
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-cover bg-center motion-reduce:block"
        style={{ backgroundImage: "url(/video/poster.jpg)" }}
      />

      {/* Scrim. Two stops rather than a flat wash: the top stays legible for
          the header chrome, the bottom goes darker so body text clears 4.5:1
          against the brightest frame of the video. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,61,46,0.72) 0%, rgba(15,61,46,0.58) 38%, rgba(15,61,46,0.88) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-20 text-center md:px-8">
        <p className="animate-hero-rise text-xs font-medium uppercase tracking-[0.2em] text-white/70 [animation-delay:0ms]">
          Ministry of AYUSH · All India Institute of Ayurveda
        </p>

        <h1 className="animate-hero-rise mt-5 font-heading text-5xl font-semibold tracking-tight text-white [animation-delay:80ms] sm:text-6xl md:text-7xl">
          SAMHITĀ{" "}
          <span className="text-[color:var(--accent)]">संहिता</span>
        </h1>

        <p className="animate-hero-rise mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-white/90 [animation-delay:160ms] md:text-xl">
          Applications over Indian traditional knowledge publish every Friday.
          From that day, <span className="font-medium text-white">Rule 55(1A)</span> gives
          six months to object.
        </p>

        <p className="animate-hero-rise mx-auto mt-4 max-w-2xl text-balance text-base text-white/75 [animation-delay:220ms]">
          Before grant, stopping a bad patent costs a form. After grant it costs
          a lawsuit. We count the days.
        </p>

        {/* The live number. Not decoration: it is derived from the same window
            arithmetic the product runs on, so it changes as the clock does. */}
        <div className="animate-hero-rise mt-10 flex flex-wrap items-center justify-center gap-3 [animation-delay:300ms]">
          {closingSoon !== null && closingSoon > 0 && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--destructive)]/50 bg-[color:var(--destructive)]/20 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
              <span
                className="size-2 animate-pulse rounded-full bg-[color:var(--destructive)] motion-reduce:animate-none"
                aria-hidden
              />
              {closingSoon} objection {closingSoon === 1 ? "window" : "windows"} closing
              within 30 days
            </span>
          )}
        </div>

        {/* Glass, not the shader button. CLAUDE.md §9 allows exactly one
            LiquidMetalButton in the app and it already lives on the dashboard
            below; a second shader canvas on the same page is the thing that
            crawls on demo hardware. */}
        <div className="animate-hero-rise mt-8 flex flex-col items-center justify-center gap-3 [animation-delay:380ms] sm:flex-row">
          <GlassButton asChild variant="onGlass" size="lg">
            <Link href="/?chat=1">
              <Sparkles className="size-4" aria-hidden />
              Ask Sahayak
            </Link>
          </GlassButton>
          <GlassButton asChild variant="onGlass" size="lg">
            <Link href="/prahari">
              <Eye className="size-4" aria-hidden />
              See the watchtower
            </Link>
          </GlassButton>
        </div>
      </div>

      {/* Scroll cue. Sits inside the hero so nothing below it is implied to be
          hidden — the point is that the hero is complete on its own. */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <ArrowDown className="animate-hero-cue size-5 text-white" aria-hidden />
      </div>
    </section>
  );
}
