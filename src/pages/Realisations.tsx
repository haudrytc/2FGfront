import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { Project } from "../lib/types";
import PageHeader from "../components/PageHeader";
import ProjectCard from "../components/ProjectCard";

export default function Realisations() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tout");

  useEffect(() => {
    api
      .get<Project[]>("/api/projects")
      .then((r) => setProjects(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["Tout", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );
  const filtered = filter === "Tout" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <PageHeader
        title="Nos réalisations"
        subtitle="Découvrez une sélection de nos chantiers : construction, rénovation, extension et plus encore."
      />

      <section className="container-page py-16">
        {categories.length > 1 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  filter === c
                    ? "bg-clay-600 text-white shadow-soft"
                    : "bg-white text-ink/70 hover:bg-sand-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-sand-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-20 text-center text-ink/50">
            Aucune réalisation pour le moment. Revenez bientôt !
          </p>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
