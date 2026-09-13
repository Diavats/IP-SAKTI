// MOCK DATA — session-local persistence for dossiers created in the UI.
// Stands in for a POST to the real backend, which would write to
// Supabase's `formulation_dossier` table. Stored in localStorage only,
// so it survives a refresh but never reaches a server or other viewers.
import type { FormulationDossier, Jurisdiction } from "@/lib/types";

const LOCAL_KEY = "samhita.mockDossiers";
const NAME_OVERRIDE_KEY = "samhita.dossierNameOverrides";

export interface NewDossierInput {
  name: string;
  dravyaList: string[];
  sourcing: FormulationDossier["sourcing"];
  claimedIndication: string;
  targetMarket: string[];
  classicalTextRef?: string;
  jurisdiction: Jurisdiction;
}

function readAll(): FormulationDossier[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as FormulationDossier[]) : [];
  } catch {
    return [];
  }
}

function writeAll(dossiers: FormulationDossier[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(dossiers));
}

export function getLocalDossiers(): FormulationDossier[] {
  return readAll();
}

export function getLocalDossier(id: string): FormulationDossier | undefined {
  return readAll().find((d) => d.id === id);
}

export function addLocalDossier(input: NewDossierInput): FormulationDossier {
  const now = new Date().toISOString();
  const dossier: FormulationDossier = {
    id: `dos-local-${Date.now().toString(36)}`,
    name: input.name,
    dravyaList: input.dravyaList,
    sourcing: input.sourcing,
    claimedIndication: input.claimedIndication,
    targetMarket: input.targetMarket,
    classicalTextRef: input.classicalTextRef,
    jurisdiction: input.jurisdiction,
    classification: {
      category: "classical_generic",
      confidence: 0,
      citation: "Pending — classifier has not run on this dossier yet.",
    },
    status: "draft",
    createdAt: now,
    updatedAt: now,
    owner: "You",
  };
  const all = [dossier, ...readAll()];
  writeAll(all);
  return dossier;
}

// Lets a user rename any dossier — seed or locally-created — to something
// they recognize (e.g. "My Ashwagandha Blend"). Stored as an id -> name
// overlay so the underlying mock record never needs mutating in place.
function readOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(NAME_OVERRIDE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function getNameOverrides(): Record<string, string> {
  return readOverrides();
}

export function setNameOverride(id: string, name: string) {
  if (typeof window === "undefined") return;
  const overrides = readOverrides();
  overrides[id] = name;
  window.localStorage.setItem(NAME_OVERRIDE_KEY, JSON.stringify(overrides));

  // Keep a locally-created dossier's own record in sync too.
  const locals = readAll();
  const idx = locals.findIndex((d) => d.id === id);
  if (idx >= 0) {
    locals[idx] = { ...locals[idx], name, updatedAt: new Date().toISOString() };
    writeAll(locals);
  }
}
