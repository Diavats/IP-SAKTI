"use client";

import * as React from "react";
import { Check, Pencil, X } from "lucide-react";
import { setNameOverride } from "@/lib/mock/local-store";

export function EditableDossierName({
  id,
  name,
  onRenamed,
}: {
  id: string;
  name: string;
  onRenamed?: (name: string) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(name);

  function save() {
    const trimmed = value.trim();
    if (trimmed && trimmed !== name) {
      setNameOverride(id, trimmed);
      onRenamed?.(trimmed);
    } else {
      setValue(name);
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setValue(name);
              setEditing(false);
            }
          }}
          className="font-heading text-2xl font-semibold text-foreground outline-none border-b-2 border-primary bg-transparent sm:text-3xl"
        />
        <button
          type="button"
          onClick={save}
          aria-label="Save name"
          className="text-primary hover:opacity-70"
        >
          <Check className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(name);
            setEditing(false);
          }}
          aria-label="Cancel"
          className="text-muted-foreground hover:opacity-70"
        >
          <X className="size-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2">
      <h1 className="font-heading text-2xl font-semibold sm:text-3xl">{name}</h1>
      <button
        type="button"
        onClick={() => {
          setValue(name);
          setEditing(true);
        }}
        aria-label="Rename dossier"
        className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
      >
        <Pencil className="size-4" />
      </button>
    </div>
  );
}
