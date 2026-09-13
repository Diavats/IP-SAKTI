import type { LucideIcon } from "lucide-react";
import {
  Eye,
  FolderOpen,
  Gauge,
  MessageSquareText,
  Settings,
  Share2,
  ScrollText,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Overview", icon: ScrollText },
  { href: "/ask", label: "Ask", icon: MessageSquareText },
  { href: "/dossiers", label: "Dossiers", icon: FolderOpen },
  { href: "/prahari", label: "Prahari", icon: Eye },
  { href: "/graph", label: "Knowledge graph", icon: Share2 },
  { href: "/evals", label: "Evals", icon: Gauge },
  { href: "/settings", label: "Settings", icon: Settings },
];
