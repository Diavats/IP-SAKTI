"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormulationDossier, Jurisdiction } from "@/lib/types";
import { addLocalDossier } from "@/lib/mock/local-store";

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function NewDossierDialog({
  onCreated,
}: {
  onCreated: (dossier: FormulationDossier) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [dravya, setDravya] = React.useState("");
  const [sourcing, setSourcing] =
    React.useState<FormulationDossier["sourcing"]>("cultivated");
  const [indication, setIndication] = React.useState("");
  const [market, setMarket] = React.useState("India");
  const [classicalRef, setClassicalRef] = React.useState("");
  const [jurisdiction, setJurisdiction] = React.useState<Jurisdiction>("IN");

  function reset() {
    setName("");
    setDravya("");
    setSourcing("cultivated");
    setIndication("");
    setMarket("India");
    setClassicalRef("");
    setJurisdiction("IN");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !dravya.trim() || !indication.trim()) return;
    const dossier = addLocalDossier({
      name: name.trim(),
      dravyaList: splitList(dravya),
      sourcing,
      claimedIndication: indication.trim(),
      targetMarket: splitList(market),
      classicalTextRef: classicalRef.trim() || undefined,
      jurisdiction,
    });
    onCreated(dossier);
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" /> New dossier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New formulation dossier</DialogTitle>
            <DialogDescription>
              This creates the dossier object Sahayak acts on. Classification and the IP
              Protection Map generate afterward — this build mocks that step.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="dossier-name">Formulation name</Label>
              <Input
                id="dossier-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amalaki-Guduchi Rasayana"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="dossier-dravya">Dravya list</Label>
              <Input
                id="dossier-dravya"
                value={dravya}
                onChange={(e) => setDravya(e.target.value)}
                placeholder="Comma-separated Latin binomials"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="dossier-sourcing">Sourcing</Label>
                <Select
                  value={sourcing}
                  onValueChange={(v) => setSourcing(v as FormulationDossier["sourcing"])}
                >
                  <SelectTrigger id="dossier-sourcing">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wild_collected">Wild-collected</SelectItem>
                    <SelectItem value="cultivated">Cultivated</SelectItem>
                    <SelectItem value="imported">Imported</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="dossier-jurisdiction">Jurisdiction</Label>
                <Select
                  value={jurisdiction}
                  onValueChange={(v) => setJurisdiction(v as Jurisdiction)}
                >
                  <SelectTrigger id="dossier-jurisdiction">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="INTL">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="dossier-indication">Claimed indication</Label>
              <Textarea
                id="dossier-indication"
                value={indication}
                onChange={(e) => setIndication(e.target.value)}
                placeholder="What is this formulation used for?"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="dossier-market">Target market</Label>
              <Input
                id="dossier-market"
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                placeholder="Comma-separated, e.g. India, European Union"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="dossier-classical">Classical text reference (optional)</Label>
              <Input
                id="dossier-classical"
                value={classicalRef}
                onChange={(e) => setClassicalRef(e.target.value)}
                placeholder="e.g. Charaka Samhita, Chikitsa Sthana 10/24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Create dossier</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
