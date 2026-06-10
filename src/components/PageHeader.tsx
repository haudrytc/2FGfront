import { motion } from "framer-motion";

export default function PageHeader({
  title,
  subtitle,
  image = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80",
}: {
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative grid min-h-[44vh] place-items-center overflow-hidden bg-ink pt-20 text-white">
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
      </div>
      <div className="container-page relative z-10 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold sm:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-white/75"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
