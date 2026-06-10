import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { api } from "../../../lib/api";
import type { Project } from "../../../lib/types";
import Modal from "../../../components/admin/Modal";
import ImageUploader from "../../../components/admin/ImageUploader";

interface FormState {
  id?: string;
  title: string;
  category: string;
  location: string;
  year: string;
  excerpt: string;
  content: string;
  featured: boolean;
  published: boolean;
  images: string[];
}

const empty: FormState = {
  title: "",
  category: "Maçonnerie",
  location: "",
  year: String(new Date().getFullYear()),
  excerpt: "",
  content: "",
  featured: false,
  published: true,
  images: [],
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await api.get<Project[]>("/api/projects?all=1");
    setProjects(res.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setForm(empty);
    setOpen(true);
  }
  function openEdit(p: Project) {
    setForm({
      id: p.id,
      title: p.title,
      category: p.category,
      location: p.location,
      year: p.year ? String(p.year) : "",
      excerpt: p.excerpt,
      content: p.content,
      featured: p.featured,
      published: p.published,
      images: p.images.map((i) => i.url),
    });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const payload = {
      title: form.title,
      category: form.category,
      location: form.location,
      year: form.year ? parseInt(form.year, 10) : null,
      excerpt: form.excerpt,
      content: form.content,
      featured: form.featured,
      published: form.published,
      coverImage: form.images[0] ?? null,
      images: form.images.map((url, order) => ({ url, order, caption: "" })),
    };
    try {
      if (form.id) await api.put(`/api/projects/${form.id}`, payload);
      else await api.post("/api/projects", payload);
      setOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: Project) {
    if (!confirm(`Supprimer la réalisation « ${p.title} » ?`)) return;
    await api.delete(`/api/projects/${p.id}`);
    await load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink/60">{projects.length} réalisation(s)</p>
        <button onClick={openNew} className="btn-primary">
          <Plus size={16} /> Nouvelle réalisation
        </button>
      </div>

      {loading ? (
        <p className="text-ink/50">Chargement…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl bg-white shadow-soft">
              <div className="relative aspect-video bg-sand-100">
                {p.coverImage && (
                  <img src={p.coverImage} alt="" className="h-full w-full object-cover" />
                )}
                {p.featured && (
                  <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-clay-600 text-white">
                    <Star size={14} />
                  </span>
                )}
                {!p.published && (
                  <span className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-1 text-xs text-white">
                    Brouillon
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-ink">{p.title}</h3>
                <p className="text-xs text-ink/50">
                  {p.category} {p.location && `· ${p.location}`}
                </p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(p)} className="btn-outline flex-1 !py-2 text-xs">
                    <Pencil size={14} /> Modifier
                  </button>
                  <button
                    onClick={() => remove(p)}
                    className="grid place-items-center rounded-full border border-red-200 px-3 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Modifier" : "Nouvelle réalisation"} wide>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink/70">Titre *</label>
            <input
              className="field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink/70">Catégorie</label>
              <input
                className="field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink/70">Lieu</label>
              <input
                className="field"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink/70">Année</label>
              <input
                className="field"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink/70">Résumé court</label>
            <input
              className="field"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Une phrase d'accroche pour la carte"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink/70">Description / discours</label>
            <textarea
              className="field resize-none"
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>
          <ImageUploader
            value={form.images}
            onChange={(images) => setForm({ ...form, images })}
            label="Photos (la 1re sert de couverture)"
          />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Mettre en avant
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Publié
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="btn-outline">
              Annuler
            </button>
            <button onClick={save} disabled={saving || !form.title} className="btn-primary">
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
