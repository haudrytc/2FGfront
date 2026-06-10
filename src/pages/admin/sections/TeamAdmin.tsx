import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../../../lib/api";
import type { TeamMember } from "../../../lib/types";
import Modal from "../../../components/admin/Modal";
import ImageUploader from "../../../components/admin/ImageUploader";

interface FormState {
  id?: string;
  name: string;
  role: string;
  bio: string;
  funFact: string;
  photo: string | null;
  order: number;
}
const empty: FormState = { name: "", role: "", bio: "", funFact: "", photo: null, order: 0 };

export default function TeamAdmin() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);

  async function load() {
    setItems((await api.get<TeamMember[]>("/api/team")).data);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    const payload = { ...form, photo: form.photo || null };
    if (form.id) await api.put(`/api/team/${form.id}`, payload);
    else await api.post("/api/team", payload);
    setOpen(false);
    await load();
  }
  async function remove(m: TeamMember) {
    if (!confirm(`Supprimer ${m.name} ?`)) return;
    await api.delete(`/api/team/${m.id}`);
    await load();
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => {
            setForm({ ...empty, order: items.length });
            setOpen(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} /> Ajouter un membre
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((m) => (
          <div key={m.id} className="rounded-2xl bg-white p-5 text-center shadow-soft">
            {m.photo ? (
              <img src={m.photo} alt={m.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
            ) : (
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-clay-100 text-2xl font-bold text-clay-700">
                {m.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <h3 className="mt-3 font-bold text-ink">{m.name}</h3>
            <p className="text-sm text-clay-600">{m.role}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setForm({ ...m, photo: m.photo });
                  setOpen(true);
                }}
                className="btn-outline flex-1 !py-2 text-xs"
              >
                <Pencil size={14} /> Modifier
              </button>
              <button
                onClick={() => remove(m)}
                className="grid place-items-center rounded-full border border-red-200 px-3 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Modifier le membre" : "Nouveau membre"}>
        <div className="space-y-4">
          <ImageUploader
            value={form.photo ? [form.photo] : []}
            onChange={(urls) => setForm({ ...form, photo: urls[0] ?? null })}
            multiple={false}
            label="Photo"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink/70">Nom</label>
              <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink/70">Rôle</label>
              <input className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink/70">Bio</label>
            <textarea
              className="field resize-none"
              rows={2}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink/70">Anecdote fun</label>
            <input
              className="field"
              value={form.funFact}
              onChange={(e) => setForm({ ...form, funFact: e.target.value })}
              placeholder="Ex : champion de café serré"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="btn-outline">
              Annuler
            </button>
            <button onClick={save} disabled={!form.name || !form.role} className="btn-primary">
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
