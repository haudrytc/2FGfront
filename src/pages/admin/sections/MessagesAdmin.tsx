import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, Phone } from "lucide-react";
import { api } from "../../../lib/api";
import type { ContactMessage } from "../../../lib/types";

export default function MessagesAdmin() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setItems((await api.get<ContactMessage[]>("/api/contact")).data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function toggleRead(m: ContactMessage) {
    await api.patch(`/api/contact/${m.id}`, { read: !m.read });
    await load();
  }
  async function remove(m: ContactMessage) {
    if (!confirm("Supprimer ce message ?")) return;
    await api.delete(`/api/contact/${m.id}`);
    await load();
  }

  if (loading) return <p className="text-ink/50">Chargement…</p>;
  if (items.length === 0)
    return <p className="py-16 text-center text-ink/50">Aucun message pour le moment.</p>;

  return (
    <div className="space-y-4">
      {items.map((m) => (
        <div
          key={m.id}
          className={`rounded-2xl border bg-white p-5 shadow-soft transition ${
            m.read ? "border-ink/10" : "border-clay-300"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                {!m.read && <span className="h-2 w-2 rounded-full bg-clay-600" />}
                <h3 className="font-bold text-ink">{m.name}</h3>
                <span className="text-sm text-ink/40">
                  {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-4 text-sm text-ink/60">
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-clay-600">
                  <Mail size={14} /> {m.email}
                </a>
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-clay-600">
                    <Phone size={14} /> {m.phone}
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleRead(m)}
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/60 hover:border-clay-400 hover:text-clay-600"
                title={m.read ? "Marquer non lu" : "Marquer lu"}
              >
                {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
              </button>
              <button
                onClick={() => remove(m)}
                className="grid h-9 w-9 place-items-center rounded-full border border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          {m.subject && <p className="mt-3 text-sm font-semibold text-ink/80">{m.subject}</p>}
          <p className="mt-1 whitespace-pre-line text-sm text-ink/70">{m.message}</p>
        </div>
      ))}
    </div>
  );
}
