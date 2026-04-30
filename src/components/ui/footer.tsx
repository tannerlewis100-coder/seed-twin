"use client";

import { motion, type Variants } from "framer-motion";
import { Link } from "@tanstack/react-router";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const socialVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 12 },
  },
};

const backgroundVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.6, ease: "easeOut" } },
};

type FooterLink = { label: string; to: string };
type FooterSection = { title: string; links: FooterLink[] };

const sections: FooterSection[] = [
  {
    title: "Shop",
    links: [
      { label: "All Compounds", to: "/shop" },
      { label: "COA Library", to: "/coa-library" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Disclaimer", to: "/disclaimer" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", to: "/sign-in" },
      { label: "Create account", to: "/sign-up" },
    ],
  },
];

const socials = [
  { href: "#", label: "Twitter", icon: "T" },
  { href: "#", label: "LinkedIn", icon: "L" },
  { href: "#", label: "Email", icon: "@" },
];

function NavSection({ title, links }: FooterSection) {
  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <div className="text-foreground font-medium text-sm tracking-wide uppercase">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <motion.li key={link.label} variants={linkVariants}>
            <Link
              to={link.to}
              className="text-foreground/60 text-sm hover:text-brand-gold transition-colors"
            >
              {link.label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      variants={socialVariants}
      whileHover={{ y: -2, scale: 1.05 }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground/70 text-xs font-medium hover:border-brand-gold/50 hover:text-brand-gold transition-colors"
    >
      {icon}
    </motion.a>
  );
}

export default function StickyFooter() {
  return (
    <div
      className="relative"
      style={{ height: "640px", clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+640px)] -top-[100vh]">
        <div className="sticky top-[calc(100vh-640px)] h-[640px]">
          <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="relative h-full bg-brand-forest-deep text-foreground/80 border-t border-white/5 overflow-hidden"
          >
            {/* Background glow */}
            <motion.div
              variants={backgroundVariants}
              className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-brand-gold/10 blur-3xl"
            />
            <motion.div
              variants={backgroundVariants}
              className="pointer-events-none absolute -bottom-40 -left-24 h-[480px] w-[480px] rounded-full bg-brand-forest/40 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8 h-full flex flex-col">
              {/* Top: brand + nav */}
              <div className="grid md:grid-cols-5 gap-10">
                <motion.div variants={itemVariants} className="md:col-span-2 space-y-4">
                  <div className="font-display text-2xl text-foreground flex items-center gap-1.5">
                    CLARUM
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  </div>
                  <p className="max-w-md text-sm text-foreground/55 leading-relaxed">
                    Batch-tested research peptides with full 5-panel COA documentation.
                    Built for researchers who refuse to take "trust me" for an answer.
                  </p>
                </motion.div>
                {sections.map((s) => (
                  <NavSection key={s.title} title={s.title} links={s.links} />
                ))}
              </div>

              {/* Wordmark */}
              <motion.div
                variants={itemVariants}
                className="mt-auto pt-12 select-none"
              >
                <div className="font-display text-[18vw] md:text-[14vw] leading-none tracking-tight text-foreground/[0.06]">
                  CLARUM
                </div>
              </motion.div>

              {/* Bottom row */}
              <motion.div
                variants={itemVariants}
                className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-foreground/45"
              >
                <span>© {new Date().getFullYear()} Clarum. All rights reserved.</span>
                <span className="max-w-md sm:text-right">
                  For in vitro laboratory research use only. Not for human or veterinary
                  use.
                </span>
                <div className="flex items-center gap-2">
                  {socials.map((s) => (
                    <SocialLink key={s.label} {...s} />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.footer>
        </div>
      </div>
    </div>
  );
}
