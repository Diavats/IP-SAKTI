"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Glass buttons.
//
// WHY THIS IS CSS AND NOT THE 21st.dev SVG FILTER:
// the liquid-glass component on 21st.dev builds its refraction from
// feTurbulence + feDisplacementMap. Those two filters re-rasterise the element
// every frame they animate, and CLAUDE.md §9 already records that a second
// continuously-running canvas will crawl on demo hardware — we have one shader
// canvas on the home page already. backdrop-filter plus layered inset shadows
// gets the same read at a fraction of the cost, composites on the GPU, and
// degrades to a flat translucent fill where backdrop-filter is unsupported.
//
// Use `onGlass` over imagery or the hero video. Use `onSurface` over the app's
// normal near-white background, where a lighter touch is needed to stay legible.

const glassButtonVariants = cva(
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium " +
    "transition-[transform,background-color,box-shadow] duration-200 ease-out " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
    "motion-reduce:transition-none motion-reduce:active:scale-100 " +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Over the hero video or any dark imagery.
        onGlass:
          "border border-white/30 bg-white/12 text-white backdrop-blur-md " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_24px_rgba(0,0,0,0.25)] " +
          "hover:bg-white/22 focus-visible:ring-white/70 focus-visible:ring-offset-transparent",
        // Over the app's light surfaces. Tinted with --primary so it still
        // reads as the emerald action colour rather than a grey pill.
        onSurface:
          "border border-[color:var(--primary)]/25 bg-[color:var(--primary)]/10 text-[color:var(--primary)] backdrop-blur-md " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_16px_color-mix(in_oklab,var(--primary)_18%,transparent)] " +
          "hover:bg-[color:var(--primary)]/18 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-background",
        // Solid emerald, for the one action on a screen that should dominate.
        solid:
          "bg-[color:var(--primary)] text-white " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_6px_20px_color-mix(in_oklab,var(--primary)_35%,transparent)] " +
          "hover:brightness-110 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-background",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-sm",
      },
    },
    defaultVariants: { variant: "onSurface", size: "default" },
  },
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(glassButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
GlassButton.displayName = "GlassButton";

export { glassButtonVariants };
