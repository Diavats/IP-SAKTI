"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { navItems, settingsItem } from "@/components/nav-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MortarPestleIcon } from "@/components/mortar-pestle-icon";
import { TopBar } from "@/components/top-bar";
import { getPrahariAlerts } from "@/lib/api";
import { cn } from "@/lib/utils";

const ITEM_HEIGHT = 36;
const ITEM_GAP = 2;

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

function NavList({
  onNavigate,
  urgentPrahariCount,
}: {
  onNavigate?: () => void;
  urgentPrahariCount: number | null;
}) {
  const pathname = usePathname();
  const activeIndex = navItems.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );
  const settingsActive = pathname.startsWith(settingsItem.href);

  return (
    <nav className="flex flex-1 flex-col justify-between px-2">
      <div className="relative flex flex-col gap-[2px]">
        {activeIndex >= 0 && (
          <div
            aria-hidden
            className="absolute inset-x-0 rounded-sm bg-sidebar-primary transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{
              height: ITEM_HEIGHT,
              transform: `translateY(${activeIndex * (ITEM_HEIGHT + ITEM_GAP)}px)`,
            }}
          />
        )}
        {navItems.map((item, i) => {
          const active = i === activeIndex;
          const Icon = item.icon;
          const showBadge = item.href === "/prahari" && !!urgentPrahariCount;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              style={{ height: ITEM_HEIGHT }}
              className={cn(
                "relative z-10 flex items-center gap-2.5 rounded-sm px-3 text-sm transition-colors",
                active
                  ? "text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <Badge variant="destructive" className="h-[18px] px-1.5 text-[10px]">
                  {urgentPrahariCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-sidebar-border pt-2 pb-1">
        <Link
          href={settingsItem.href}
          onClick={onNavigate}
          style={{ height: ITEM_HEIGHT }}
          className={cn(
            "flex items-center gap-2.5 rounded-sm px-3 text-sm transition-colors",
            settingsActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          )}
        >
          <settingsItem.icon className="size-4 shrink-0" strokeWidth={1.75} />
          {settingsItem.label}
        </Link>
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [urgentPrahariCount, setUrgentPrahariCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    getPrahariAlerts().then((alerts) => {
      setUrgentPrahariCount(alerts.filter((a) => a.daysRemaining < 30).length);
    });
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <Wordmark />
        <NavList urgentPrahariCount={urgentPrahariCount} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
          <div className="flex items-center gap-3 md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Wordmark />
                <NavList onNavigate={() => setOpen(false)} urgentPrahariCount={urgentPrahariCount} />
              </SheetContent>
            </Sheet>
            <MortarPestleIcon className="size-6 shrink-0" />
            <span className="font-heading text-base font-semibold">SAMHITĀ</span>
          </div>
          <TopBar />
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
