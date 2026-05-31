import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Clock, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Clarum — Support, COAs & Bulk Inquiries | CLARUM" },
      {
        name: "description",
        content:
          "Reach Clarum for product questions, COA requests, bulk research orders, or compliance inquiries. Mon to Fri, 9 to 5 EST.",
      },
      { property: "og:title", content: "Contact Clarum" },
      {
        property: "og:description",
        content: "Get in touch for product, COA, and bulk research inquiries.",
      },
    ],
  }),
});

const contactInfo = [
  { icon: Mail, label: "Email", value: "clarumpeps@gmail.com" },
  { icon: MapPin, label: "Location", value: "Keller, Texas" },
  { icon: Clock, label: "Hours", value: "Mon to Fri · 9 to 5 EST" },
];

type FormErrors = Partial<Record<"name" | "email" | "message", string>>;

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [website, setWebsite] = useState(""); // honeypot
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (name.length < 2) errs.name = "Please enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address.";
    if (message.length < 10) errs.message = "Message must be at least 10 characters.";
    else if (message.length > 5000) errs.message = "Message must be 5000 characters or less.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    try {
      const res = await fetch("https://admin.clarumpeptides.com/wp-json/clarum/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          website,
        }),
      });
      const data = await res.json().catch(() => ({}) as { ok?: boolean; error?: string });

      if (res.ok && data?.ok) {
        toast.success("Message sent — we'll get back to you within 1 business day");
        setForm({ name: "", email: "", subject: "", message: "" });
        setErrors({});
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } else if (res.status === 429) {
        toast.error("Too many messages — try again in an hour");
      } else if (res.status === 400) {
        toast.error(data?.error || "Please check the form and try again.");
      } else {
        toast.error("Something went wrong. Please email clarumpeps@gmail.com directly.");
      }
    } catch {
      toast.error("Something went wrong. Please email clarumpeps@gmail.com directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <Toaster />
      <main>
        <section className="relative bg-background border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 gold-line-texture pointer-events-none" />
          <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-14 text-center">
            <div className="inline-flex items-center gap-2 mb-4 justify-center">
              <span className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Contact
              </span>
              <span className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h1 className="font-display text-[40px] sm:text-5xl md:text-6xl text-foreground leading-tight">
              <RevealText text="Get in touch." />
            </h1>
            <RevealOnScroll as="p" delay={180} className="mt-5 text-foreground/55">
              Questions about a compound, a COA, or a bulk research order. We're here.
            </RevealOnScroll>
          </div>
        </section>

        <section className="bg-card border-b border-white/5">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 py-14 md:py-20 grid lg:grid-cols-[1fr_1.6fr] gap-10">
            <aside className="space-y-4">
              {contactInfo.map((c, i) => (
                <RevealOnScroll
                  key={c.label}
                  delay={i * 100}
                  className="flex items-start gap-4 bg-background rounded-2xl border border-white/5 p-5"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center shrink-0">
                    <c.icon className="h-4 w-4 text-brand-gold" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-foreground/45">
                      {c.label}
                    </div>
                    <div className="text-sm text-foreground mt-0.5">{c.value}</div>
                  </div>
                </RevealOnScroll>
              ))}
              <div className="bg-background rounded-2xl border border-white/5 p-5">
                <div className="text-[10px] uppercase tracking-wider text-foreground/45 mb-2">
                  Quick Links
                </div>
                <ul className="space-y-1.5 text-sm">
                  <li>
                    <Link to="/faq" className="text-foreground/75 hover:text-brand-gold">
                      Frequently Asked Questions
                    </Link>
                  </li>
                  <li>
                    <Link to="/coa-library" className="text-foreground/75 hover:text-brand-gold">
                      Browse the COA Library
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop" className="text-foreground/75 hover:text-brand-gold">
                      Shop the Catalog
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>

            <div className="space-y-4">
              {showSuccess && (
                <div className="flex items-start gap-3 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 p-4">
                  <CheckCircle2 className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                  <div className="text-sm text-foreground">
                    <div className="font-medium">Message sent.</div>
                    <div className="text-foreground/70">
                      We'll get back to you within 1 business day.
                    </div>
                  </div>
                </div>
              )}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-background rounded-3xl border border-white/5 p-7 space-y-4"
              >
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: "1px",
                    height: "1px",
                    opacity: 0,
                  }}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Name"
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    error={errors.name}
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    error={errors.email}
                  />
                </div>
                <Field
                  label="Subject"
                  value={form.subject}
                  onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
                />
                <div>
                  <label
                    htmlFor="contact-message"
                    className="text-[10px] uppercase tracking-wider text-foreground/55"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={6}
                    maxLength={5000}
                    aria-invalid={!!errors.message}
                    className="mt-1.5 w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-brand-gold/50 transition-colors resize-none"
                    placeholder="Tell us what you need…"
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-gold text-brand-forest px-7 py-3.5 text-sm font-medium hover:bg-brand-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-foreground/55">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className="mt-1.5 w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-brand-gold/50 transition-colors"
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
