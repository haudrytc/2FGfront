import { useEffect, useState } from "react";
import { Save, CheckCircle2, Plus, Trash2, RotateCcw } from "lucide-react";
import { api } from "../../../lib/api";
import type { Settings } from "../../../lib/types";
import {
  parseSimConfig,
  DEFAULT_SIM,
  PLACEMENT_LABELS,
  type SimConfig,
  type SimItem,
  type SimUnit,
  type SimPlacement,
} from "../../../lib/simulator";
import { ICON_NAMES } from "../../../components/Icon";

const UNITS: SimUnit[] = ["m²", "ml", "u", "projet"];

export default function SimulatorAdmin() {
  const [config, setConfig] = useState<SimConfig>(DEFAULT_SIM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<Settings>("/api/settings").then((r) => setConfig(parseSimConfig(r.data)));
  }, []);

  function patchItem(id: string, patch: Partial<SimItem>) {
    setConfig((c) => ({ ...c, items: c.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
  }
  function removeItem(id: string) {
    setConfig((c) => ({ ...c, items: c.items.filter((it) => it.id !== id) }));
  }
  function addItem() {
    setConfig((c) => ({
      ...c,
      items: [
        ...c.items,
        { id: `item_${Date.now()}`, label: "Nouvelle prestation", unit: "m²", min: 50, max: 100, icon: "Hammer" },
      ],
    }));
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await api.put("/api/settings", { simulator_config: JSON.stringify(config) });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Emplacement */}
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="font-display text-lg font-bold text-ink">Simulateur de devis</h3>
        <p className="mt-0.5 text-sm text-ink/50">
          Choisissez où afficher l'estimation « à la louche » sur le site.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {(Object.keys(PLACEMENT_LABELS) as SimPlacement[]).map((p) => {
            const on = config.placement === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setConfig((c) => ({ ...c, placement: p }))}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  on
                    ? "border-clay-500 bg-clay-50 text-clay-800 shadow-soft"
                    : "border-ink/10 bg-white text-ink/60 hover:border-clay-300"
                }`}
              >
                <span
                  className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${
                    on ? "bg-clay-600" : "bg-ink/15"
                  }`}
                />
                {PLACEMENT_LABELS[p]}
              </button>
            );
          })}
        </div>
        {config.placement === "page" && (
          <p className="mt-3 text-xs text-ink/45">
            Un lien « Devis » est ajouté au menu et la page est accessible sur <code>/devis</code>.
          </p>
        )}
      </div>

      {/* Prestations */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Prestations & tarifs</h3>
          <button onClick={addItem} className="btn-outline !py-2 text-xs">
            <Plus size={14} /> Ajouter
          </button>
        </div>

        <div className="hidden gap-2 px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink/40 sm:grid sm:grid-cols-[1fr,80px,90px,90px,110px,32px]">
          <span>Prestation</span>
          <span>Unité</span>
          <span>Prix mini</span>
          <span>Prix maxi</span>
          <span>Icône</span>
          <span></span>
        </div>

        <div className="space-y-2">
          {config.items.map((it) => (
            <div
              key={it.id}
              className="grid grid-cols-2 items-center gap-2 rounded-xl border border-ink/5 bg-sand-50 p-2 sm:grid-cols-[1fr,80px,90px,90px,110px,32px]"
            >
              <input
                className="field !py-2 text-sm"
                value={it.label}
                onChange={(e) => patchItem(it.id, { label: e.target.value })}
              />
              <select
                className="field !py-2 text-sm"
                value={it.unit}
                onChange={(e) => patchItem(it.id, { unit: e.target.value as SimUnit })}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="field !py-2 text-sm"
                value={it.min}
                onChange={(e) => patchItem(it.id, { min: Number(e.target.value) })}
              />
              <input
                type="number"
                className="field !py-2 text-sm"
                value={it.max}
                onChange={(e) => patchItem(it.id, { max: Number(e.target.value) })}
              />
              <select
                className="field !py-2 text-sm"
                value={it.icon}
                onChange={(e) => patchItem(it.id, { icon: e.target.value })}
              >
                {ICON_NAMES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeItem(it.id)}
                className="grid h-9 w-9 place-items-center justify-self-end rounded-lg text-ink/40 hover:bg-red-50 hover:text-red-600"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-ink/45">
          Prix par unité (€). Pour l'unité « projet », la fourchette est un forfait global (sans
          quantité).
        </p>

        <button
          onClick={() => setConfig((c) => ({ ...c, items: DEFAULT_SIM.items }))}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink/50 hover:text-clay-700"
        >
          <RotateCcw size={13} /> Réinitialiser les prestations par défaut
        </button>
      </div>

      {/* Niveaux de finition */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="font-display text-lg font-bold text-ink">Niveaux de finition</h3>
        <p className="mt-0.5 text-sm text-ink/50">Coefficient multiplicateur appliqué à l'estimation.</p>
        <div className="mt-4 space-y-2">
          {config.finishes.map((f, i) => (
            <div key={f.id} className="flex items-center gap-2">
              <input
                className="field !py-2 text-sm"
                value={f.label}
                onChange={(e) =>
                  setConfig((c) => {
                    const finishes = [...c.finishes];
                    finishes[i] = { ...f, label: e.target.value };
                    return { ...c, finishes };
                  })
                }
              />
              <div className="flex items-center gap-1.5 rounded-xl border border-ink/15 bg-white px-3 py-2">
                <span className="text-xs text-ink/40">×</span>
                <input
                  type="number"
                  step="0.05"
                  className="w-16 bg-transparent text-right font-bold text-ink outline-none"
                  value={f.factor}
                  onChange={(e) =>
                    setConfig((c) => {
                      const finishes = [...c.finishes];
                      finishes[i] = { ...f, factor: Number(e.target.value) };
                      return { ...c, finishes };
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button onClick={save} disabled={saving} className="btn-primary">
          <Save size={16} /> {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
            <CheckCircle2 size={16} /> Enregistré
          </span>
        )}
      </div>
    </div>
  );
}
