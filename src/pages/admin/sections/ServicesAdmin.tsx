import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../../../lib/api";
import type { Service } from "../../../lib/types";
import Modal from "../../../components/admin/Modal";
import Icon, { ICON_NAMES } from "../../../components/Icon";

interface FormState {
  id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}
const empty: FormState = { title: "", description: "", icon: "Hammer", order: 0 };

const ICONS = ICON_NAMES;

export default function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);

  async function load() {
    setItems((await api.get<Service[]>("/api/services")).data);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (form.id) await api.put(`/api/services/${form.id}`, form);
    else await api.post("/api/services", form);
    setOpen(false);
    await load();
  }
  async function remove(s: Service) {
    if (!confirm(`Supprimer « ${s.title} » ?`)) return;
    await api.delete(`/api/services/${s.id}`);
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
          <Plus size={16} /> Nouveau service
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <div key={s.id} className="rounded-2xl bg-white p-5 shadow-soft">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-clay-50 text-clay-600">
              <Icon name={s.icon} size={22} />
            </span>
            <h3 className="mt-3 font-bold text-ink">{s.title}</h3>
            <p className="mt-1 text-sm text-ink/60">{s.description}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setForm(s);
                  setOpen(true);
                }}
                className="btn-outline flex-1 !py-2 text-xs"
              >
                <Pencil size={14} /> Modifier
              </button>
              <button
                onClick={() => remove(s)}
                className="grid place-items-center rounded-full border border-red-200 px-3 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Modifier le service" : "Nouveau service"}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink/70">Titre</label>
            <input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink/70">Description</label>
            <textarea
              className="field resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink/70">Icône</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setForm({ ...form, icon: name })}
                  className={`grid h-11 w-11 place-items-center rounded-xl border transition ${
                    form.icon === name
                      ? "border-clay-500 bg-clay-50 text-clay-600"
                      : "border-ink/10 text-ink/50 hover:border-clay-300"
                  }`}
                >
                  <Icon name={name} size={20} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="btn-outline">
              Annuler
            </button>
            <button onClick={save} disabled={!form.title} className="btn-primary">
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
