"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PanelLeftClose } from "lucide-react";
import { navItems, settingsItem } from "@/components/nav-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TopBar } from "@/components/top-bar";
import { getPrahariAlerts } from "@/lib/api";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ITEM_HEIGHT = 36;
const ITEM_GAP = 2;

function Wordmark({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 py-5",
        collapsed ? "justify-center px-2" : "px-5",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-mono.png" alt="" className="size-8 shrink-0 object-contain" />
      <div className={cn("flex flex-col gap-0.5", collapsed && "hidden")}>
        <span className="font-heading text-lg font-semibold tracking-tight text-sidebar-foreground">
          SAMHITĀ <span className="text-sidebar-foreground/70">संहिता</span>
        </span>
        <span className="text-xs text-sidebar-foreground/70">IP-Sakti Sahayak</span>
      </div>
    </div>
  );
}

function NavList({
  onNavigate,
  urgentPrahariCount,
  collapsed = false,
}: {
  onNavigate?: () => void;
  urgentPrahariCount: number | null;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const t = useT();
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
                "relative z-10 flex items-center gap-2.5 rounded-sm text-sm transition-colors",
                collapsed ? "justify-center px-0" : "px-3",
                active
                  ? "text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
              {/* Nav labels translate. "Prahari" and "Sahayak" do not — they are
                  product names, fixed by the brand commitments, and are passed
                  through `t()` unchanged because no dictionary key exists. */}
              <span className={cn("flex-1", collapsed && "sr-only")}>{t(item.label)}</span>
              {showBadge && (
                <Badge
                  variant="destructive"
                  className="h-[18px] border-transparent bg-destructive px-1.5 text-[10px] text-on-brand"
                >
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
            "flex items-center gap-2.5 rounded-sm text-sm transition-colors",
            collapsed ? "justify-center px-0" : "px-3",
            settingsActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          )}
        >
          <settingsItem.icon className="size-4 shrink-0" strokeWidth={1.75} />
          <span className={cn(collapsed && "sr-only")}>{t(settingsItem.label)}</span>
        </Link>
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  // Sidebar collapse. Persisted because a visitor who collapses it once means
  // it for the session, not for one route.
  const [collapsed, setCollapsed] = React.useState(false);
  React.useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only: localStorage is unreadable during SSR and in a lazy initializer.
      setCollapsed(localStorage.getItem("samhita.nav.collapsed") === "1");
    } catch {
      // Storage blocked; expanded is a fine default.
    }
  }, []);
  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("samhita.nav.collapsed", next ? "1" : "0");
      } catch {
        // Non-fatal: the choice just will not survive a reload.
      }
      return next;
    });
  }, []);

  const [open, setOpen] = React.useState(false);
  const [urgentPrahariCount, setUrgentPrahariCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    getPrahariAlerts().then((alerts) => {
      setUrgentPrahariCount(alerts.filter((a) => a.daysRemaining < 30).length);
    });
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-out motion-reduce:transition-none md:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <Wordmark collapsed={collapsed} />
        <NavList urgentPrahariCount={urgentPrahariCount} collapsed={collapsed} />
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="m-2 flex h-9 items-center justify-center gap-2 rounded-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <PanelLeftClose
            className={cn("size-4 shrink-0 transition-transform duration-300", collapsed && "rotate-180")}
            strokeWidth={1.75}
            aria-hidden
          />
          <span className={cn("text-xs", collapsed && "sr-only")}>Collapse</span>
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-transparent bg-brand px-4 py-3 text-on-brand">
          <div className="flex items-center gap-3 md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation"
                  className="text-on-brand hover:bg-white/10 hover:text-on-brand"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Wordmark />
                <NavList onNavigate={() => setOpen(false)} urgentPrahariCount={urgentPrahariCount} />
              </SheetContent>
            </Sheet>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-mono.png" alt="" className="size-6 shrink-0 object-contain" />
            <span className="font-heading text-base font-semibold">SAMHITĀ</span>
          </div>
          <TopBar />
        </header>

        {/* `relative` gives any page a safe anchor for a full-bleed decorative
            background (`absolute inset-0`) without that background ever being
            able to push this box wider than the viewport. */}
        <main className="relative flex flex-1 flex-col px-4 pt-6 md:px-8 md:pt-8">
          <div className="w-full flex-1 pb-6 md:pb-8">{children}</div>
          <SiteFooter />
        </main>
      </div>
    </div>
  );
}

function SiteFooter() {
  const t = useT();
  return (
    <footer className="-mx-4 mt-12 flex flex-col gap-3 bg-brand px-4 py-6 text-xs text-on-brand/80 md:-mx-8 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a href="#" className="text-on-brand hover:underline">
            {t("About")}
          </a>
          <a href="mailto:team@vedanova.dev" className="text-on-brand hover:underline">
            {t("Contact")}
          </a>
        </div>
        <span className="font-mono">{t("Corpus")} 2026-09-10</span>
      </div>
      {/* The disclaimer translates. It has to be understood to do its job,
          unlike a citation, which has to stay exact to do its job. */}
      <p>{t("Information, not legal advice.")}</p>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p>Built for SIH 2026 · PS 26045 · Ministry of AYUSH / AIIA</p>
        <p>Built by Team VedaNova</p>
      </div>
    </footer>
  );
}
