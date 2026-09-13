"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { navItems } from "@/components/nav-config";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MortarPestleIcon } from "@/components/mortar-pestle-icon";
import { cn } from "@/lib/utils";

function Wordmark() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <MortarPestleIcon className="size-8 shrink-0" />
      <div className="flex flex-col gap-0.5">
        <span className="font-heading text-lg font-semibold tracking-tight text-sidebar-foreground">
          SAMHITĀ <span className="text-muted-foreground">संहिता</span>
        </span>
        <span className="text-xs text-muted-foreground">IP-Sakti Sahayak</span>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-2">
      {navItems.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function CorpusFooter() {
  return (
    <div className="border-t border-sidebar-border px-5 py-3">
      <p className="font-mono text-[11px] text-muted-foreground">
        Corpus version 2026-09-10
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <Wordmark />
        <NavList />
        <CorpusFooter />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-background px-4 py-3 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Wordmark />
              <NavList onNavigate={() => setOpen(false)} />
              <CorpusFooter />
            </SheetContent>
          </Sheet>
          <MortarPestleIcon className="size-6 shrink-0" />
          <span className="font-heading text-base font-semibold">SAMHITĀ</span>
        </header>

        {/* `relative` gives any page a safe anchor for a full-bleed decorative
            background (`absolute inset-0`) without that background ever being
            able to push this box wider than the viewport. */}
        <main className="relative flex flex-1 flex-col px-4 py-6 md:px-8 md:py-8">
          <div className="w-full flex-1">{children}</div>
          <SiteFooter />
        </main>
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>
        <span className="font-heading font-semibold text-foreground">SAMHITĀ</span> — About
        Us: built for SIH 2026, PS 26045 (Ministry of AYUSH / AIIA), mapping Ayurvedic
        formulations to their protectable IP surface.
      </p>
      <p>
        Reach out to us at{" "}
        <a href="mailto:xyz@mail.com" className="text-foreground hover:underline">
          xyz@mail.com
        </a>
      </p>
    </footer>
  );
}
