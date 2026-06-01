"use client";

import { motion, type Variants } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.86a8.16 8.16 0 0 0 4.77 1.52V6.93a4.85 4.85 0 0 1-1.84-.24z" />
    </svg>
  );
}
import clarumLogo from "@/assets/clarum-logo.png";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

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
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Refund Policy", to: "/refund-policy" },
      { label: "Shipping Policy", to: "/shipping-policy" },
    ],
  },
];

const socials = [
  { href: "#", label: "Facebook", Icon: Facebook },
  { href: "https://instagram.com/clarumpeptides", label: "Instagram", Icon: Instagram },
  { href: "#", label: "TikTok", Icon: TikTokIcon },
  { href: "mailto:clarumpeps@gmail.com", label: "Email", Icon: Mail },
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
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      variants={socialVariants}
      whileHover={{ y: -4, scale: 1.15, rotate: -6 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 14 }}
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold/80 hover:text-brand-forest-deep hover:border-brand-gold transition-colors duration-300 overflow-hidden"
    >
      <span className="absolute inset-0 rounded-full bg-brand-gold scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
      <span className="absolute inset-0 rounded-full bg-brand-gold/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Icon className="h-4 w-4 relative z-10" />
    </motion.a>
  );
}

export default function StickyFooter() {
  return (
    <div
      className="relative h-[1280px] md:h-[640px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+1280px)] md:h-[calc(100vh+640px)] -top-[100vh]">
        <div className="sticky top-[calc(100vh-1280px)] md:top-[calc(100vh-640px)] h-[1280px] md:h-[640px]">
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
              <div className="grid md:grid-cols-6 gap-10">
                <motion.div variants={itemVariants} className="md:col-span-2 space-y-4">
                  <Link
                    to="/"
                    aria-label="Clarum Research Peptides"
                    className="group inline-flex items-center transition-transform duration-500 hover:scale-[1.03]"
                  >
                    <img src={clarumLogo} alt="Clarum Research Peptides" className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_24px_rgba(212,175,55,0.35)]" />
                  </Link>
                  <p className="max-w-md text-sm text-foreground/55 leading-relaxed">
                    Batch-tested research peptides. Five lab panels per batch,
                    every COA public, no login required. For researchers who
                    won't take "trust me" for an answer.
                  </p>
                </motion.div>
                {sections.map((s) => (
                  <NavSection key={s.title} title={s.title} links={s.links} />
                ))}
              </div>

              {/* Morphing wordmark */}
              <motion.div
                variants={itemVariants}
                className="flex-1 flex items-center justify-center min-h-[140px] md:min-h-[200px] my-6"
              >
                <GooeyText
                  texts={["Clarum", "Purity", "Tested"]}
                  morphTime={1.2}
                  cooldownTime={0.6}
                  className="h-[120px] md:h-[180px]"
                  textClassName="text-brand-gold font-serif text-6xl md:text-8xl tracking-tight"
                />
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
