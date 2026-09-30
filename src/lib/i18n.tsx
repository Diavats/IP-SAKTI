"use client";

// Multilingual UI layer.
//
// THE RULE THAT SHAPES THIS FILE (CLAUDE.md §8, plan §11):
// translate the question and the answer, never the citation. A translated
// statute is not the statute. So anything that identifies a source stays in
// its authentic form no matter which language is selected:
//
//   - statutory references      s.11A, s.25(1), Rule 55(1A), s.3(p)
//   - form names                Form 7A, Form 9
//   - application numbers       202641008734 A, EP4218765 A1
//   - species binomials         Withania somnifera
//   - source titles             Ayurvedic Formulary of India
//   - corpus version stamps
//
// Those are rendered directly, never through `t()`. If you find yourself
// adding a dictionary key for a section number, stop: that is the bug this
// comment exists to prevent.
//
// Language set is the four fixed in the deck brief: English, Hindi, Malayalam
// and Tamil, chosen for where Ayurveda and Siddha manufacturing actually sits
// rather than for count. Sanskrit is deliberately absent as a UI language; it
// appears only inside citations, in its authentic form.
//
// PROVENANCE: these strings are model-provided and have NOT been reviewed by a
// native speaker or a legal translator. That is why the /evals multilingual
// card still reads "Not yet measured". Do not change that card on the strength
// of this file existing.

import * as React from "react";

export type Lang = "en" | "hi" | "ml" | "ta";

export const LANGS: { code: Lang; label: string; endonym: string }[] = [
  { code: "en", label: "English", endonym: "English" },
  { code: "hi", label: "Hindi", endonym: "हिन्दी" },
  { code: "ml", label: "Malayalam", endonym: "മലയാളം" },
  { code: "ta", label: "Tamil", endonym: "தமிழ்" },
];

/** Keys are English so a missing translation degrades to readable English. */
const dict: Record<Lang, Record<string, string>> = {
  en: {},

  hi: {
    // Navigation
    Ask: "पूछें",
    Dossiers: "डोसियर",
    "Knowledge graph": "ज्ञान ग्राफ़",
    Evals: "मूल्यांकन",
    Settings: "सेटिंग्स",
    // Top bar
    Jurisdiction: "अधिकार क्षेत्र",
    India: "भारत",
    International: "अंतरराष्ट्रीय",
    Corpus: "संग्रह",
    Language: "भाषा",
    // Prahari
    "Replay last sweep": "पिछली जाँच दोबारा देखें",
    "Open window": "खुली अवधि",
    "Window closed": "अवधि समाप्त",
    "days left to file": "दाखिल करने के दिन शेष",
    "Published on": "प्रकाशन तिथि",
    "Earliest grant": "संभावित स्वीकृति तिथि",
    Applicant: "आवेदक",
    Status: "स्थिति",
    New: "नया",
    Reviewing: "समीक्षाधीन",
    "Dossier drafted": "मसौदा तैयार",
    Filed: "दाखिल",
    // Verdicts
    Open: "उपलब्ध",
    Barred: "वर्जित",
    "May be open": "संभवतः उपलब्ध",
    // Footer and disclaimers
    "Information, not legal advice.": "यह जानकारी है, कानूनी सलाह नहीं।",
    About: "हमारे बारे में",
    Contact: "संपर्क",
    Sources: "स्रोत",
    Citation: "उद्धरण",
    "Human review required": "मानव समीक्षा आवश्यक",
    Dossier: "डोसियर",
    Dravya: "द्रव्य",
    Classification: "वर्गीकरण",
    "Open regimes": "उपलब्ध व्यवस्थाएँ",
    Application: "आवेदन",
    "Matched species": "मिलती प्रजातियाँ",
    Published: "प्रकाशित",
    "Days to earliest grant": "संभावित स्वीकृति तक दिन",
    "Portfolio snapshot": "पोर्टफोलियो सारांश",
    "Audit log": "ऑडिट लॉग",
    "Consent ledger": "सहमति रजिस्टर",
    "Illustrative values for this build": "इस बिल्ड के लिए उदाहरणात्मक मान",
    "Ask Sahayak": "सहायक से पूछें",
    "See the watchtower": "प्रहरी देखें",
  },

  ml: {
    Ask: "ചോദിക്കുക",
    Dossiers: "ഡോസിയറുകൾ",
    "Knowledge graph": "വിജ്ഞാന ഗ്രാഫ്",
    Evals: "മൂല്യനിർണയം",
    Settings: "ക്രമീകരണങ്ങൾ",
    Jurisdiction: "അധികാരപരിധി",
    India: "ഇന്ത്യ",
    International: "അന്താരാഷ്ട്രം",
    Corpus: "ശേഖരം",
    Language: "ഭാഷ",
    "Replay last sweep": "കഴിഞ്ഞ പരിശോധന വീണ്ടും കാണുക",
    "Open window": "തുറന്ന കാലാവധി",
    "Window closed": "കാലാവധി അവസാനിച്ചു",
    "days left to file": "സമർപ്പിക്കാൻ ബാക്കിയുള്ള ദിവസങ്ങൾ",
    "Published on": "പ്രസിദ്ധീകരിച്ച തീയതി",
    "Earliest grant": "സാധ്യമായ ആദ്യ അനുമതി",
    Applicant: "അപേക്ഷകൻ",
    Status: "നില",
    New: "പുതിയത്",
    Reviewing: "പരിശോധനയിൽ",
    "Dossier drafted": "കരട് തയ്യാറായി",
    Filed: "സമർപ്പിച്ചു",
    Open: "ലഭ്യം",
    Barred: "വിലക്കിയത്",
    "May be open": "ലഭ്യമായേക്കാം",
    "Information, not legal advice.": "ഇത് വിവരമാണ്, നിയമോപദേശമല്ല.",
    About: "ഞങ്ങളെക്കുറിച്ച്",
    Contact: "ബന്ധപ്പെടുക",
    Sources: "ഉറവിടങ്ങൾ",
    Citation: "അവലംബം",
    "Human review required": "മനുഷ്യ പരിശോധന ആവശ്യമാണ്",
    Dossier: "ഡോസിയർ",
    Dravya: "ദ്രവ്യം",
    Classification: "വർഗ്ഗീകരണം",
    "Open regimes": "ലഭ്യമായ വിഭാഗങ്ങൾ",
    Application: "അപേക്ഷ",
    "Matched species": "പൊരുത്തപ്പെട്ട സ്പീഷീസ്",
    Published: "പ്രസിദ്ധീകരിച്ചത്",
    "Days to earliest grant": "ആദ്യ അനുമതി വരെ ദിവസങ്ങൾ",
    "Portfolio snapshot": "പോർട്ട്ഫോളിയോ അവലോകനം",
    "Audit log": "ഓഡിറ്റ് ലോഗ്",
    "Consent ledger": "സമ്മത രജിസ്റ്റർ",
    "Illustrative values for this build": "ഈ ബിൽഡിനുള്ള ഉദാഹരണ മൂല്യങ്ങൾ",
    "Ask Sahayak": "സഹായകിനോട് ചോദിക്കൂ",
    "See the watchtower": "പ്രഹരി കാണുക",
  },

  ta: {
    Ask: "கேட்கவும்",
    Dossiers: "கோப்புகள்",
    "Knowledge graph": "அறிவு வரைபடம்",
    Evals: "மதிப்பீடு",
    Settings: "அமைப்புகள்",
    Jurisdiction: "அதிகார வரம்பு",
    India: "இந்தியா",
    International: "சர்வதேசம்",
    Corpus: "தொகுப்பு",
    Language: "மொழி",
    "Replay last sweep": "கடந்த சோதனையை மீண்டும் காண்க",
    "Open window": "திறந்த காலம்",
    "Window closed": "காலம் முடிந்தது",
    "days left to file": "தாக்கல் செய்ய மீதமுள்ள நாட்கள்",
    "Published on": "வெளியிடப்பட்ட தேதி",
    "Earliest grant": "சாத்தியமான முதல் அனுமதி",
    Applicant: "விண்ணப்பதாரர்",
    Status: "நிலை",
    New: "புதியது",
    Reviewing: "பரிசீலனையில்",
    "Dossier drafted": "வரைவு தயார்",
    Filed: "தாக்கல் செய்யப்பட்டது",
    Open: "கிடைக்கிறது",
    Barred: "தடைசெய்யப்பட்டது",
    "May be open": "கிடைக்கக்கூடும்",
    "Information, not legal advice.": "இது தகவல், சட்ட ஆலோசனை அல்ல.",
    About: "எங்களைப் பற்றி",
    Contact: "தொடர்பு",
    Sources: "ஆதாரங்கள்",
    Citation: "மேற்கோள்",
    "Human review required": "மனித பரிசீலனை தேவை",
    Dossier: "கோப்பு",
    Dravya: "திரவ்யம்",
    Classification: "வகைப்பாடு",
    "Open regimes": "கிடைக்கும் பிரிவுகள்",
    Application: "விண்ணப்பம்",
    "Matched species": "பொருந்திய இனங்கள்",
    Published: "வெளியிடப்பட்டது",
    "Days to earliest grant": "முதல் அனுமதி வரை நாட்கள்",
    "Portfolio snapshot": "போர்ட்ஃபோலியோ சுருக்கம்",
    "Audit log": "தணிக்கை பதிவு",
    "Consent ledger": "ஒப்புதல் பதிவேடு",
    "Illustrative values for this build": "இந்த பதிப்பிற்கான எடுத்துக்காட்டு மதிப்புகள்",
    "Ask Sahayak": "சகாயக்கிடம் கேள்",
    "See the watchtower": "பிரகரியைப் பார்",
  },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a UI string. Never pass a citation, section number or species name. */
  t: (key: string) => string;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "samhita.lang";

// --- external store ---------------------------------------------------------
//
// The selected language lives outside React, in localStorage, and is read
// through useSyncExternalStore rather than restored by an effect.
//
// Why not useState + useEffect: setting state inside an effect to "catch up"
// with storage renders once in English and again in the real language, which
// flashes, and React 19's lint rule rejects it. useSyncExternalStore gives the
// server a stable "en" snapshot and the client the stored value on the very
// first paint, with no mismatch and no flash. Cross-tab sync comes free with
// the storage event.

const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // Another tab changing the language should update this one.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Returns a string primitive, so React's Object.is check is stable across
 * calls and this cannot loop. Anything that throws (private mode, blocked
 * site data) falls back to English.
 */
function getSnapshot(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && LANGS.some((l) => l.code === saved)) return saved;
  } catch {
    // Storage unavailable. English is a fine fallback.
  }
  return "en";
}

/** The server has no storage, so it always renders English. */
function getServerSnapshot(): Lang {
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = React.useCallback((l: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // Non-fatal: the choice just will not survive a reload.
    }
    // Keep the document language honest for screen readers.
    document.documentElement.lang = l;
    listeners.forEach((fn) => fn());
  }, []);

  const t = React.useCallback(
    (key: string) => dict[lang][key] || key,
    [lang],
  );

  const value = React.useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  // Falling back to English rather than throwing keeps a component usable in
  // isolation (tests, storybook) without wrapping it in a provider.
  if (!ctx) return { lang: "en", setLang: () => {}, t: (k) => k };
  return ctx;
}

/** Shorthand for components that only need to translate. */
export function useT() {
  return useLanguage().t;
}
