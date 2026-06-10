import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";
import { useSettings } from "../lib/useSettings";
import PageHeader from "../components/PageHeader";

export default function Contact() {
  const { settings } = useSettings();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSending(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      await api.post("/api/contact", payload);
      setSent(true);
    } catch {
      setError("Une erreur est survenue. Réessayez ou appelez-nous directement.");
    } finally {
      setSending(false);
    }
  }

  const infos = [
    { icon: MapPin, label: "Adresse", value: settings.address, href: undefined },
    { icon: Phone, label: "Téléphone", value: settings.phone, href: `tel:${settings.phone?.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: Clock, label: "Horaires", value: settings.hours, href: undefined },
  ].filter((i) => i.value);

  return (
    <div>
      <PageHeader
        title="Contactez-nous"
        subtitle="Un projet, une question ? Écrivez-nous, nous vous répondons rapidement."
        image="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="container-page grid gap-10 py-20 lg:grid-cols-5">
        {/* Infos */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-ink">Parlons de votre projet</h2>
          <p className="mt-3 text-ink/60">
            Devis gratuit et sans engagement. Nous intervenons sur {settings.zone || "Marignane et alentours"}.
          </p>
          <div className="mt-8 space-y-5">
            {infos.map((info) => (
              <div key={info.label} className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-clay-50 text-clay-600">
                  <info.icon size={20} />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink/40">
                    {info.label}
                  </div>
                  {info.href ? (
                    <a href={info.href} className="font-semibold text-ink hover:text-clay-600">
                      {info.value}
                    </a>
                  ) : (
                    <div className="font-semibold text-ink">{info.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-3">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-soft"
            >
              <CheckCircle2 size={56} className="text-clay-600" />
              <h3 className="mt-4 text-2xl font-bold text-ink">Message envoyé !</h3>
              <p className="mt-2 text-ink/60">
                Merci, nous revenons vers vous au plus vite.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-3xl bg-white p-7 shadow-soft sm:p-9">
              {/* honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink/70">Nom *</label>
                  <input name="name" required className="field" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink/70">Téléphone</label>
                  <input name="phone" className="field" placeholder="06 ..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-ink/70">Email *</label>
                  <input name="email" type="email" required className="field" placeholder="vous@email.fr" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-ink/70">Sujet</label>
                  <input name="subject" className="field" placeholder="Construction, rénovation, devis…" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-ink/70">Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="field resize-none"
                    placeholder="Décrivez votre projet…"
                  />
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <button type="submit" disabled={sending} className="btn-primary mt-6 w-full sm:w-auto">
                {sending ? "Envoi…" : "Envoyer le message"} <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
