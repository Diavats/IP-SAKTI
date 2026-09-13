import type { LucideIcon } from "lucide-react";
import {
  Eye,
  FolderOpen,
  Gauge,
  MessageSquareText,
  Settings,
  Share2,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Ask is the home route - the empty state (portfolio snapshot, dossiers,
// closing windows) lives inside it rather than as a separate Overview page.
export const navItems: NavItem[] = [
  { href: "/", label: "Ask", icon: MessageSquareText },
  { href: "/dossiers", label: "Dossiers", icon: FolderOpen },
  { href: "/prahari", label: "Prahari", icon: Eye },
  { href: "/graph", label: "Knowledge graph", icon: Share2 },
  { href: "/evals", label: "Evals", icon: Gauge },
];

// Detached from the main nav list (see AppShell) - always pinned at the
// bottom, never part of the sliding active-indicator group.
export const settingsItem: NavItem = { href: "/settings", label: "Settings", icon: Settings };
