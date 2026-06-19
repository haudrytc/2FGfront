import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Logo from "./Logo";
import { useSettings } from "../lib/useSettings";
import { parseSimConfig } from "../lib/simulator";

const baseLinks = [
  { to: "/", label: "Accueil" },
  { to: "/realisations", label: "Réalisations" },
  { to: "/a-propos", label: "L'équipe" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();
  const { pathname } = useLocation();

  // Ajoute le lien "Devis" si le simulateur est configuré en page dédiée.
  const links = [...baseLinks];
  if (parseSimConfig(settings).placement === "page") {
    links.splice(3, 0, { to: "/devis", label: "Devis" });
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || pathname !== "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-sand-50/90 shadow-soft backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="container-page flex h-20 items-center justify-between py-3">
        <Logo dark={!solid} />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-clay-700"
                    : solid
                    ? "text-ink/70 hover:text-clay-700"
                    : "text-white/90 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn-primary ml-3">
            <Phone size={16} /> Devis gratuit
          </Link>
        </div>

        <button
          className={`md:hidden ${solid ? "text-ink" : "text-white"}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-sand-50 md:hidden"
          >
            <div className="container-page flex flex-col gap-1 pb-6 pt-2">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-semibold ${
                      isActive ? "bg-clay-50 text-clay-700" : "text-ink/80"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <a href={`tel:${settings.phone?.replace(/\s/g, "")}`} className="btn-primary mt-2">
                <Phone size={16} /> {settings.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
