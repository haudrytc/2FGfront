import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, HardHat } from "lucide-react";
import { api } from "../lib/api";
import { useSettings } from "../lib/useSettings";
import type { TeamMember } from "../lib/types";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";
import Seo from "../components/Seo";

const AVATAR_BG = ["bg-clay-600", "bg-ink", "bg-clay-700", "bg-clay-500"];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function APropos() {
  const { settings } = useSettings();
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    api.get<TeamMember[]>("/api/team").then((r) => setTeam(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <Seo
        title="L'équipe — Entreprise familiale de maçonnerie à Marignane"
        description="Fondée en 2021 par les frères Anthony et Jeremy Freitas, la Sarl 2F Général est une entreprise familiale de maçonnerie générale à Marignane, au service de vos projets dans les Bouches-du-Rhône."
        path="/a-propos"
      />
      <PageHeader
        title="L'équipe 2F Général"
        subtitle="Des artisans passionnés, le casque vissé et le sourire en plus."
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Histoire */}
      <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
        <Reveal direction="right">
          <span className="eyebrow">Notre histoire</span>
          <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
            {settings.about_title || "La maçonnerie dans le sang"}
          </h2>
          <p className="mt-5 text-ink/70">{settings.about_text}</p>
          <p className="mt-4 text-ink/70">
            Chez nous, chaque chantier est une fierté. On aime le travail bien fait, les murs
            d'aplomb et les clients qui repartent le sourire aux lèvres. Une petite équipe soudée,
            beaucoup d'expérience… et toujours la même envie de bien faire.
          </p>
          <div className="mt-8 flex gap-8">
            <div>
              <div className="text-3xl font-extrabold text-clay-600">
                <Counter to={parseInt(settings.years_experience || "20", 10)} suffix=" ans" />
              </div>
              <div className="text-sm text-ink/60">de métier</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-clay-600">
                <Counter to={team.length || 4} />
              </div>
              <div className="text-sm text-ink/60">artisans</div>
            </div>
          </div>
        </Reveal>
        <Reveal direction="left" className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&w=800&q=80"
            alt=""
            className="mt-8 aspect-[3/4] w-full rounded-2xl object-cover shadow-soft"
          />
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
            alt=""
            className="aspect-[3/4] w-full rounded-2xl object-cover shadow-soft"
          />
        </Reveal>
      </section>

      {/* Équipe */}
      <section className="bg-white py-20">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow"><HardHat size={14} /> Les visages</span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              Celles et ceux qui bâtissent
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                className="group rounded-3xl bg-sand-50 p-5 text-center transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <div className="relative mx-auto h-32 w-32">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="h-32 w-32 rounded-full object-cover ring-4 ring-white"
                    />
                  ) : (
                    <div
                      className={`grid h-32 w-32 place-items-center rounded-full text-3xl font-extrabold text-white ${
                        AVATAR_BG[i % AVATAR_BG.length]
                      }`}
                    >
                      {initials(m.name)}
                    </div>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{m.name}</h3>
                <p className="text-sm font-semibold text-clay-600">{m.role}</p>
                {m.bio && <p className="mt-2 text-sm text-ink/60">{m.bio}</p>}
                {m.funFact && (
                  <div className="mt-3 rounded-xl bg-white p-3 text-left text-xs text-ink/70">
                    <span className="inline-flex items-center gap-1 font-semibold text-clay-600">
                      <Sparkles size={12} /> Le saviez-vous ?
                    </span>
                    <p className="mt-1">{m.funFact}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {team.length === 0 && (
            <p className="mt-10 text-center text-ink/50">L'équipe arrive bientôt…</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20 text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-ink">Envie de travailler avec nous ?</h2>
          <p className="mx-auto mt-3 max-w-lg text-ink/60">
            Contactez l'équipe pour discuter de votre projet autour d'un café.
          </p>
          <Link to="/contact" className="btn-primary mt-6">
            Nous contacter <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
