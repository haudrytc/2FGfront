import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Tag, ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import type { Project } from "../lib/types";
import Lightbox from "../components/Lightbox";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    setStatus("loading");
    api
      .get<Project>(`/api/projects/${slug}`)
      .then((r) => {
        setProject(r.data);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="grid min-h-[60vh] place-items-center pt-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-clay-200 border-t-clay-600" />
      </div>
    );
  }

  if (status === "error" || !project) {
    return (
      <div className="container-page grid min-h-[60vh] place-items-center pt-20 text-center">
        <div>
          <h1 className="text-2xl font-bold">Réalisation introuvable</h1>
          <Link to="/realisations" className="btn-primary mt-6">
            Retour aux réalisations
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images.length
    ? project.images
    : project.coverImage
    ? [{ id: "cover", url: project.coverImage, caption: "", order: 0 }]
    : [];

  return (
    <div className="pt-20">
      {/* En-tête image */}
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img
          src={project.coverImage || images[0]?.url}
          alt={project.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 z-10 pb-10 text-white">
          <Link
            to="/realisations"
            className="mb-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft size={16} /> Toutes les réalisations
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-3xl font-extrabold sm:text-5xl"
          >
            {project.title}
          </motion.h1>
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-white/80">
            <span className="inline-flex items-center gap-2"><Tag size={15} /> {project.category}</span>
            {project.location && (
              <span className="inline-flex items-center gap-2"><MapPin size={15} /> {project.location}</span>
            )}
            {project.year && (
              <span className="inline-flex items-center gap-2"><Calendar size={15} /> {project.year}</span>
            )}
          </div>
        </div>
      </section>

      {/* Discours */}
      {project.content && (
        <section className="container-page py-16">
          <div className="mx-auto max-w-3xl whitespace-pre-line text-lg leading-relaxed text-ink/80">
            {project.content}
          </div>
        </section>
      )}

      {/* Galerie */}
      {images.length > 0 && (
        <section className="container-page pb-20">
          <h2 className="mb-8 text-2xl font-bold text-ink">Galerie</h2>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {images.map((img, i) => (
              <motion.button
                key={img.id}
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="block w-full overflow-hidden rounded-2xl shadow-soft"
              >
                <img
                  src={img.url}
                  alt={img.caption || project.title}
                  loading="lazy"
                  className="w-full transition-transform duration-500 hover:scale-105"
                />
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-ink bg-grit py-16 text-center text-white">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">Un projet similaire en tête ?</h2>
          <Link to="/contact" className="btn-primary mt-6">
            Demander un devis <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Lightbox
        images={images}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onPrev={() => setLightbox((i) => (i === null ? i : (i - 1 + images.length) % images.length))}
        onNext={() => setLightbox((i) => (i === null ? i : (i + 1) % images.length))}
      />
    </div>
  );
}
