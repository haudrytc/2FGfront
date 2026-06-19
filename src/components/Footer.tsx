import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook } from "lucide-react";
import Logo from "./Logo";
import { useSettings } from "../lib/useSettings";
import { CITIES, SERVICES } from "../lib/seo";

export default function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink bg-grit text-sand-100">
      <div className="container-page grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm text-sand-100/70">
            {settings.tagline || "L'art de bâtir, la passion du détail."}
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-clay-300">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm text-sand-100/80">
            <li><Link to="/" className="hover:text-clay-300">Accueil</Link></li>
            <li><Link to="/realisations" className="hover:text-clay-300">Réalisations</Link></li>
            <li><Link to="/a-propos" className="hover:text-clay-300">L'équipe</Link></li>
            <li><Link to="/contact" className="hover:text-clay-300">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-clay-300">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-sand-100/80">
            {settings.address && (
              <li className="flex gap-3"><MapPin size={18} className="shrink-0 text-clay-400" />{settings.address}</li>
            )}
            {settings.phone && (
              <li className="flex gap-3">
                <Phone size={18} className="shrink-0 text-clay-400" />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-clay-300">{settings.phone}</a>
              </li>
            )}
            {settings.email && (
              <li className="flex gap-3">
                <Mail size={18} className="shrink-0 text-clay-400" />
                <a href={`mailto:${settings.email}`} className="hover:text-clay-300">{settings.email}</a>
              </li>
            )}
            {settings.hours && (
              <li className="flex gap-3"><Clock size={18} className="shrink-0 text-clay-400" />{settings.hours}</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-clay-300">
            Zone d'intervention
          </h4>
          <p className="text-sm text-sand-100/80">{settings.zone || "Marignane et alentours"}</p>
          {settings.facebook && (
            <a
              href={settings.facebook}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-clay-600"
            >
              <Facebook size={16} /> Facebook
            </a>
          )}
        </div>
      </div>

      {/* Bandeau SEO : prestations + villes desservies (référencement local) */}
      <div className="border-t border-white/10">
        <div className="container-page py-8 text-xs text-sand-100/55">
          <p className="font-semibold uppercase tracking-widest text-clay-300">Nos prestations</p>
          <p className="mt-2 leading-relaxed">{SERVICES.join(" · ")}</p>
          <p className="mt-5 font-semibold uppercase tracking-widest text-clay-300">
            Maçonnerie dans les Bouches-du-Rhône
          </p>
          <p className="mt-2 leading-relaxed">
            La Sarl 2F Général intervient pour vos travaux de maçonnerie, construction, rénovation et
            piscine à {CITIES.join(", ")}.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-sand-100/50 sm:flex-row">
          <p>© {year} {settings.company_name || "Sarl 2F Général"}. Tous droits réservés.</p>
          <Link to="/admin/login" className="hover:text-clay-300">Espace admin</Link>
        </div>
      </div>
    </footer>
  );
}
