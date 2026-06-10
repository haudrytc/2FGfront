import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * Image de fond en parallaxe : se déplace plus lentement que le scroll.
 * `speed` = amplitude du décalage en pixels.
 */
export function ParallaxImage({
  src,
  speed = 120,
  className = "",
  overlay = "bg-ink/55",
  children,
}: {
  src: string;
  speed?: number;
  className?: string;
  overlay?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y }}
        className="absolute inset-0 -top-[20%] h-[140%] w-full bg-cover bg-center will-change-transform"
      >
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      </motion.div>
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
