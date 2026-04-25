"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/auth-store";
import InteractiveHeroButton from "@/components/ui/InteractiveHeroButton";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3, // slight delay to wait for hero image scale
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // ease-out-quint
    },
  },
};

/**
 * HeroSection — art-exhibition entrance overlay
 *
 * Rendered inside the hero <section> on the landing page.
 * Sits above the background image; all colours via --site-* tokens.
 *
 * Design notes:
 * - Left-aligned, never centred — feels like an exhibition placard
 * - Typography hierarchy: eyebrow → h1 (bold) → sub-label (italic light) → body
 * - Two CTAs of equal visual weight (no dominant gradient button)
 * - Auth-conditional: guests see a tertiary "Đăng ký" link; logged-in users see nothing extra
 * - Zero blue, zero glow, zero gradient fills on interactive elements
 */
const HeroSection = () => {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  const { accessToken } = useAuthStore();

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
      {/* Subtle Text Backdrop Overlay — enhances legibility against complex parallax backgrounds */}
      <div 
        className="absolute -inset-y-32 -left-32 w-[120%] lg:w-[150%] bg-gradient-to-r from-black/60 via-black/20 to-transparent blur-2xl pointer-events-none -z-10 opacity-60" 
      />

      <motion.div 
        className="max-w-2xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Eyebrow — small label, amber accent, wide tracking */}
        <motion.p
          variants={itemVariants}
          className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-5 sm:mb-7"
          style={{ color: "var(--site-accent)" }}
        >
          ARTCHAIN
        </motion.p>

        {/* Primary heading — h1 for SEO / a11y, stays on the page only once */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
        >
          <span style={{ color: "var(--site-accent)" }}>{t.heroTitle}</span>
          <br />
          <span style={{ color: "var(--site-ink)" }}>
            {t.heroTitleHighlight}
          </span>
          <br />
          <span
            className="font-light italic"
            style={{ color: "var(--site-ink)" }}
          >
            {t.heroTitleSuffix}
          </span>
        </motion.h1>

        {/* Primary CTAs — using InteractiveHeroButton component */}
        <motion.div variants={itemVariants} className="mt-8 sm:mt-12 flex flex-wrap gap-3 sm:gap-4">
          <InteractiveHeroButton 
            href="/gallery" 
            label={`${t.exploreGallery} ${t.exhibition}`} 
            variant="secondary" 
          />
          {/* <InteractiveHeroButton 
            href="/contests" 
            label={`${t.joinCompetition} ${t.competitionPainting}`} 
            variant="primary" 
          /> */}
        </motion.div>

        {/* Tertiary — register prompt for guests only */}
        {/* {!accessToken && (
          <motion.p
            variants={itemVariants}
            className="mt-6 text-xs sm:text-sm"
            style={{ color: "var(--site-ink-muted)" }}
          >
            Chưa có tài khoản?{" "}
            <Link
              href="/auth"
              className="font-semibold underline underline-offset-4 transition-colors duration-200"
              style={{ color: "var(--site-accent)" }}
            >
              {t.registerArtistFree}
            </Link>
          </motion.p>
        )} */}
      </motion.div>
    </div>
  );
};

export default HeroSection;