import { useEffect, useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { api } from "../../../lib/api";
import type { Settings } from "../../../lib/types";
import { BUILD_SCENES } from "../../../components/BuildScene";

type Option = { value: string; label: string };
type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select" | "toggle";
  options?: Option[];
  help?: string;
  default?: string;
};

const FIELDS: Field[] = [
  { key: "company_name", label: "Nom de la société" },
  { key: "tagline", label: "Slogan" },
  { key: "hero_title", label: "Titre d'accueil (hero)" },
  { key: "hero_subtitle", label: "Sous-titre d'accueil", type: "textarea" },
  { key: "about_title", label: "Titre « à propos »" },
  { key: "about_text", label: "Texte « à propos »", type: "textarea" },
  { key: "years_experience", label: "Années d'expérience" },
  { key: "projects_count", label: "Nombre de chantiers" },
  { key: "phone", label: "Téléphone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Adresse" },
  { key: "zone", label: "Zone d'intervention" },
  { key: "hours", label: "Horaires" },
  { key: "facebook", label: "Lien Facebook" },
];

const WIDGET_FIELDS: Field[] = [
  {
    key: "build_widget_enabled",
    label: "Afficher l'animation « chantier »",
    type: "toggle",
    default: "on",
    help: "Petite scène qui se construit au fil du défilement de la page d'accueil.",
  },
  {
    key: "build_widget_position",
    label: "Position de l'animation",
    type: "select",
    default: "bubble-left",
    options: [
      { value: "bubble-left", label: "Bulle — en bas à gauche" },
      { value: "bubble-right", label: "Bulle — en bas à droite" },
      { value: "top-bar", label: "Barre de progression en haut" },
      { value: "inline", label: "Intégrée dans la page" },
    ],
  },
  {
    key: "build_widget_scene",
    label: "Construction affichée",
    type: "select",
    default: "random",
    options: [{ value: "random", label: "Aléatoire à chaque visite" }, ...BUILD_SCENES],
  },
];

export default function SettingsAdmin() {
  const [values, setValues] = useState<Settings>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<Settings>("/api/settings").then((r) => setValues(r.data));
  }, []);

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await api.put("/api/settings", values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  function renderField(f: Field) {
    const value = values[f.key] ?? f.default ?? "";

    if (f.type === "toggle") {
      const on = value === "on";
      return (
        <div key={f.key} className="flex items-start justify-between gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink/70">{f.label}</label>
            {f.help && <p className="mt-0.5 text-xs text-ink/45">{f.help}</p>}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => set(f.key, on ? "off" : "on")}
            className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors ${
              on ? "bg-clay-600" : "bg-ink/20"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                on ? "left-[1.375rem]" : "left-0.5"
              }`}
            />
          </button>
        </div>
      );
    }

    return (
      <div key={f.key}>
        <label className="mb-1 block text-sm font-semibold text-ink/70">{f.label}</label>
        {f.help && <p className="mb-1 text-xs text-ink/45">{f.help}</p>}
        {f.type === "textarea" ? (
          <textarea
            className="field resize-none"
            rows={3}
            value={value}
            onChange={(e) => set(f.key, e.target.value)}
          />
        ) : f.type === "select" ? (
          <select className="field" value={value} onChange={(e) => set(f.key, e.target.value)}>
            {f.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input className="field" value={value} onChange={(e) => set(f.key, e.target.value)} />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
        {FIELDS.map(renderField)}
      </div>

      <div className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-soft">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">Animation « chantier »</h3>
          <p className="mt-0.5 text-sm text-ink/50">
            Réglez l'effet de construction qui suit le défilement de la page d'accueil.
          </p>
        </div>
        {WIDGET_FIELDS.map(renderField)}
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
