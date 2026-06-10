import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "../lib/types";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#e6dcce'/><text x='50%' y='50%' fill='#b8662f' font-family='sans-serif' font-size='28' text-anchor='middle'>2F Général</text></svg>`
  );

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
    >
      <Link
        to={`/realisations/${project.slug}`}
        className="group block overflow-hidden rounded-2xl bg-white shadow-soft transition-shadow hover:shadow-card"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={project.coverImage || PLACEHOLDER}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80" />
          <span className="absolute left-4 top-4 rounded-full bg-clay-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {project.category}
          </span>
          <span className="absolute bottom-4 right-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </span>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-ink transition-colors group-hover:text-clay-700">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink/60">{project.excerpt}</p>
          <div className="mt-3 flex items-center gap-3 text-xs font-medium text-ink/50">
            {project.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} /> {project.location}
              </span>
            )}
            {project.year && <span>· {project.year}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
