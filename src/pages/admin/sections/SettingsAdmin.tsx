import { useEffect, useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { api } from "../../../lib/api";
import type { Settings } from "../../../lib/types";

const FIELDS: { key: string; label: string; type?: "text" | "textarea" }[] = [
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

export default function SettingsAdmin() {
  const [values, setValues] = useState<Settings>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<Settings>("/api/settings").then((r) => setValues(r.data));
  }, []);

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

  return (
    <div className="max-w-2xl">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-semibold text-ink/70">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                className="field resize-none"
                rows={3}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
            ) : (
              <input
                className="field"
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
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
