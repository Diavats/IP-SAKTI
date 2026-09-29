import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";
import { IntroGate } from "@/components/intro-gate";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SAMHITĀ — IP-Sakti Sahayak",
  description:
    "Formulation IP Protection Map and prior-art watchtower for Ayurvedic innovation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <IntroGate />
        {/* LanguageProvider wraps everything so any component can translate.
            It restores the saved choice after mount rather than during render,
            which is why the server always emits lang="en" here and the client
            corrects document.documentElement.lang on selection. */}
        <LanguageProvider>
          <TooltipProvider>
            <AppShell>{children}</AppShell>
          </TooltipProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
