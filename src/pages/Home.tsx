import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  ThumbsUp,
  Hammer,
  ChevronDown,
} from "lucide-react";
import { api } from "../lib/api";
import { useSettings } from "../lib/useSettings";
import type { Project, Service } from "../lib/types";
import { ParallaxImage } from "../components/Parallax";
import Seo from "../components/Seo";
import { localBusinessJsonLd } from "../lib/seo";
import BuildScene from "../components/BuildScene";
import PriceSimulator from "../components/PriceSimulator";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";
import Icon from "../components/Icon";
import ProjectCard from "../components/ProjectCard";

const HERO_IMG =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80";
const CTA_IMG =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=2000&q=80";

const VALUES = [
  { icon: ShieldCheck, title: "Travail garanti", text: "Des ouvrages conformes aux règles de l'art, assurés et durables." },
  { icon: Clock, title: "Délais respectés", text: "Un planning clair et tenu, du premier coup de pelle à la livraison." },
  { icon: ThumbsUp, title: "Devis transparent", text: "Un chiffrage détaillé et gratuit, sans mauvaise surprise." },
];

export default function Home() {
  const { settings } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    api.get<Service[]>("/api/services").then((r) => setServices(r.data)).catch(() => {});
    api.get<Project[]>("/api/projects").then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const showcase = (featured.length ? featured : projects).slice(0, 3);

  return (
    <div>
      <Seo
        title="Maçon à Marignane — Maçonnerie, Construction & Rénovation"
        description="Sarl 2F Général, entreprise de maçonnerie générale à Marignane (13). Construction de maison, rénovation, extension, gros œuvre, façade, carrelage et piscine dans les Bouches-du-Rhône. Devis gratuit."
        path="/"
        jsonLd={localBusinessJsonLd()}
      />
      {/* ---------- HERO ---------- */}
      <section className="relative h-screen min-h-[640px]">
        <ParallaxImage src={HERO_IMG} speed={140} overlay="bg-ink/65" className="h-full">
          <div className="container-page flex h-screen min-h-[640px] flex-col justify-center pt-20 text-white">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="eyebrow !text-clay-300"
            >
              <Hammer size={14} /> {settings.address || "Marignane (13)"}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl"
            >
              {settings.hero_title || "Construisons ensemble vos projets en dur"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 max-w-xl text-lg text-white/80"
            >
              {settings.hero_subtitle ||
                "Maçonnerie générale, rénovation et construction neuve."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/contact" className="btn-primary">
                Demander un devis <ArrowRight size={16} />
              </Link>
              <Link to="/realisations" className="btn-light">
                Voir nos réalisations
              </Link>
            </motion.div>
          </div>
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown />
          </motion.div>
        </ParallaxImage>
      </section>

      {/* ---------- VALEURS ---------- */}
      <section className="relative z-10 -mt-16">
        <div className="container-page">
          <div className="grid gap-5 rounded-3xl bg-white p-6 shadow-card sm:grid-cols-3 sm:p-8">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1} className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-clay-50 text-clay-600">
                  <v.icon size={22} />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{v.title}</h3>
                  <p className="mt-1 text-sm text-ink/60">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- À PROPOS (teaser) ---------- */}
      <section className="container-page grid items-center gap-12 py-24 lg:grid-cols-2">
        <Reveal direction="right">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=1200&q=80"
              alt="Chantier 2F Général"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-card"
            />
            <div className="absolute -bottom-6 -right-4 rounded-2xl bg-clay-600 p-6 text-white shadow-card sm:-right-6">
              <div className="text-4xl font-extrabold">
                <Counter to={parseInt(settings.years_experience || "20", 10)} suffix=" ans" />
              </div>
              <div className="text-sm text-white/80">d'expérience</div>
            </div>
          </div>
        </Reveal>
        <Reveal direction="left">
          <span className="eyebrow">Qui sommes-nous</span>
          <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
            {settings.about_title || "Une entreprise de maçonnerie à taille humaine"}
          </h2>
          <p className="mt-5 text-ink/70">{settings.about_text}</p>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-extrabold text-gradient-clay">
                <Counter to={parseInt(settings.projects_count || "150", 10)} suffix="+" />
              </div>
              <div className="text-sm text-ink/60">Chantiers réalisés</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gradient-clay">100%</div>
              <div className="text-sm text-ink/60">Clients satisfaits</div>
            </div>
          </div>
          <Link to="/a-propos" className="btn-outline mt-8">
            Rencontrer l'équipe <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>

      {/* ---------- SAVOIR-FAIRE ---------- */}
      <section className="bg-white py-24">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Notre savoir-faire</span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              Tous vos travaux, du gros œuvre <span className="text-gradient-clay">aux finitions</span>
            </h2>
            <p className="mt-4 text-ink/60">
              Une maîtrise complète du bâtiment pour mener vos projets de A à Z.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.1}>
                <div className="group h-full rounded-2xl border border-ink/5 bg-sand-50 p-7 transition-all hover:-translate-y-1 hover:border-clay-200 hover:shadow-card">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-clay-600 text-white transition-transform group-hover:scale-110">
                    <Icon name={s.icon} size={26} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink/60">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SIMULATEUR DE DEVIS ---------- */}
      <PriceSimulator where="home" />

      {/* ---------- CHANTIER QUI SE CONSTRUIT (scroll) ---------- */}
      <BuildScene />

      {/* ---------- CTA PARALLAXE ---------- */}
      <ParallaxImage src={CTA_IMG} speed={100} overlay="bg-ink/75" className="py-28">
        <div className="container-page text-center text-white">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-3xl font-extrabold sm:text-5xl">
              Un projet de construction ou de rénovation ?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/80">
              Parlons-en. Nous étudions votre projet et vous remettons un devis détaillé et gratuit.
            </p>
            <Link to="/contact" className="btn-primary mt-8">
              Obtenir mon devis gratuit <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </ParallaxImage>

      {/* ---------- RÉALISATIONS ---------- */}
      {showcase.length > 0 && (
        <section className="container-page py-24">
          <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">Nos réalisations</span>
              <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
                Des chantiers qui parlent pour nous
              </h2>
            </div>
            <Link to="/realisations" className="btn-outline">
              Tout voir <ArrowRight size={16} />
            </Link>
          </Reveal>
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
