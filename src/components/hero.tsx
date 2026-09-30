"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Sparkles } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { getPrahariAlerts } from "@/lib/api";
import { useT } from "@/lib/i18n";

// Phase 2: the app, with the same video still running behind the top of it.
//
// Deliberately NOT full-viewport. The intro already owned the whole screen
// (components/intro-overlay.tsx); once it ends the visitor should be able to
// see that there is a product here, so this occupies roughly the top half and
// the dashboard begins immediately underneath.
//
// The video loops silently and forever here. It is the same file the intro
// played, so it is already in cache and starts instantly.
export function Hero() {
  const t = useT();
  const [closingSoon, setClosingSoon] = React.useState<number | null>(null);
  const [wide, setWide] = React.useState<boolean | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // The source is portrait (1280x1920). In a landscape banner, object-cover on
  // a portrait file discards most of the frame AND upscales the narrow width to
  // fill. So there are two encodes: a 16:9 centre crop for landscape, and the
  // full portrait for phones. Chosen in JS rather than <source media=...>,
  // which browsers evaluate inconsistently inside <video>, so only the needed
  // file is ever fetched.
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v || wide === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [wide]);

  React.useEffect(() => {
    getPrahariAlerts().then((alerts) => {
      setClosingSoon(alerts.filter((a) => a.daysRemaining >= 0 && a.daysRemaining < 30).length);
    });
  }, []);

  // Narrow viewports reuse the intro crop (1280x1200) rather than the raw
  // portrait: it is already cached from phase 1, it is 2.1MB smaller, and on a
  // phone-width background the extra height was being cropped away anyway.
  const videoSrc = wide ? "/video/awakening-wide.mp4" : "/video/awakening-intro.mp4";
  const posterSrc = wide ? "/video/poster-wide.jpg" : "/video/poster-intro.jpg";

  return (
    <section className="relative -mx-4 -mt-6 flex min-h-[58svh] items-center overflow-hidden md:-mx-8 md:-mt-8">
      {wide !== null && (
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 size-full object-cover motion-reduce:hidden"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-cover bg-center motion-reduce:block"
        style={{ backgroundImage: `url(${posterSrc})` }}
      />

      {/* Two stops rather than a flat wash: body copy has to clear 4.5:1
          against the brightest frame, and the bottom edge needs to hand off
          into the page background without a visible seam. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,61,46,0.74) 0%, rgba(15,61,46,0.60) 45%, rgba(15,61,46,0.92) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-14 text-center md:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/75">
          Ministry of AYUSH · All India Institute of Ayurveda
        </p>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          SAMHITĀ <span className="text-[color:var(--accent)]">संहिता</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/90 md:text-lg">
          Applications over Indian traditional knowledge publish every Friday.
          From that day, <span className="font-medium text-white">Rule 55(1A)</span>{" "}
          gives six months to object. Before grant, stopping a bad patent costs a
          form. After grant it costs a lawsuit.
        </p>

        {/* Live, derived from the same window arithmetic the product runs on. */}
        {closingSoon !== null && closingSoon > 0 && (
          <div className="mt-7 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--destructive)]/50 bg-[color:var(--destructive)]/30 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
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
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
    </section>
  );
}
