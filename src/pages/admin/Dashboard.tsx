import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutGrid,
  Hammer,
  Users,
  Mail,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../lib/auth";
import Logo from "../../components/Logo";
import ProjectsAdmin from "./sections/ProjectsAdmin";
import ServicesAdmin from "./sections/ServicesAdmin";
import TeamAdmin from "./sections/TeamAdmin";
import MessagesAdmin from "./sections/MessagesAdmin";
import SettingsAdmin from "./sections/SettingsAdmin";

type Tab = "projects" | "services" | "team" | "messages" | "settings";

const TABS: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
  { id: "projects", label: "Réalisations", icon: LayoutGrid },
  { id: "services", label: "Savoir-faire", icon: Hammer },
  { id: "team", label: "Équipe", icon: Users },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "settings", label: "Réglages", icon: SettingsIcon },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("projects");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sand-50 lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-ink/10 bg-white p-5 lg:static lg:flex ${
          menuOpen ? "flex" : "hidden"
        }`}
      >
        <Logo />
        <nav className="mt-8 flex-1 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                tab === t.id ? "bg-clay-600 text-white shadow-soft" : "text-ink/70 hover:bg-sand-100"
              }`}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="space-y-1 border-t border-ink/10 pt-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink/70 hover:bg-sand-100"
          >
            <ExternalLink size={18} /> Voir le site
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu */}
      <div className="flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/10 bg-white/90 px-5 py-4 backdrop-blur lg:px-8">
          <button className="lg:hidden" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
          <h1 className="text-lg font-bold text-ink">
            {TABS.find((t) => t.id === tab)?.label}
          </h1>
          <span className="text-sm text-ink/50">Bonjour, {user?.name}</span>
        </header>

        <div className="p-5 lg:p-8">
          {tab === "projects" && <ProjectsAdmin />}
          {tab === "services" && <ServicesAdmin />}
          {tab === "team" && <TeamAdmin />}
          {tab === "messages" && <MessagesAdmin />}
          {tab === "settings" && <SettingsAdmin />}
        </div>
      </div>
    </div>
  );
}
