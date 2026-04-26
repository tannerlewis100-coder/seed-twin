import { createFileRoute } from "@tanstack/react-router";
import heroCapsule from "@/assets/hero-capsule.jpg";
import duoJars from "@/assets/duo-jars.jpg";
import capsuleMacro from "@/assets/capsule-macro.jpg";
import lifestylePour from "@/assets/lifestyle-pour.jpg";
import island from "@/assets/island.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sprout — Daily Synbiotic for Gut Health" },
      {
        name: "description",
        content:
          "Clinically-studied daily synbiotic with capsule-in-capsule technology. Supports digestion, regularity, and whole-body health.",
      },
    ],
  }),
});

function AnnouncementBar() {
  return (
    <div className="bg-brand-lime text-brand-forest text-sm">
      <div className="mx-auto max-w-7xl px-6 py-2.5 text-center">
        Is SP-01® Daily Synbiotic right for you? <span aria-hidden>→</span>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/40">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="/" className="flex items-center gap-1.5 font-display text-2xl text-brand-forest">
            sprout
            <span className="inline-block w-2 h-2 rounded-full bg-brand-forest" />
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-brand-forest">
            <a href="#shop" className="hover:opacity-70">Shop</a>
            <a href="#science" className="hover:opacity-70">Science</a>
            <a href="#learn" className="hover:opacity-70">Learn</a>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <a href="#" className="hidden sm:inline text-sm text-brand-forest hover:opacity-70">
            Sign in
          </a>
          <a
            href="#shop"
            className="inline-flex items-center rounded-full bg-brand-forest text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-brand-forest-deep transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-20 grid lg:grid-cols-2 gap-10 items-center">
        <div className="order-2 lg:order-1">
          <span className="inline-block rounded-full border border-brand-forest/30 px-3 py-1 text-xs text-brand-forest mb-6">
            SP-01® Daily Synbiotic
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-brand-forest">
            A healthy gut can change your life.
          </h1>
          <p className="mt-6 text-lg text-brand-forest/80 max-w-md">
            Our capsule-in-capsule technology delivers targeted probiotic strains where they're
            needed most — easing bloat, gas, and irregularity.*
          </p>
          <div className="mt-8 flex items-center gap-6">
            <a
              href="#shop"
              className="inline-flex items-center rounded-full bg-brand-forest text-primary-foreground px-7 py-3.5 text-sm font-medium hover:bg-brand-forest-deep transition-colors"
            >
              Shop SP-01®
            </a>
            <a
              href="#quiz"
              className="text-sm text-brand-forest underline underline-offset-4 hover:opacity-70"
            >
              Take the quiz →
            </a>
          </div>
        </div>
        <div className="order-1 lg:order-2 flex justify-center">
          <img
            src={heroCapsule}
            alt="Dark green capsule surrounded by a halo of prebiotic powder"
            width={1280}
            height={1280}
            className="w-full max-w-xl h-auto"
          />
        </div>
      </div>
    </section>
  );
}

function Products() {
  const products = [
    { tag: "Bestseller", code: "SP–01®", name: "Daily Synbiotic", price: "49.99" },
    { tag: "New", code: "MV–02™", name: "Daily Multivitamin", price: "39.99" },
    { tag: "New", code: "AM–02™", name: "Energy + Focus", price: "34.99" },
    { tag: "New", code: "PM–02™", name: "Sleep + Restore", price: "34.99" },
  ];
  return (
    <section id="shop" className="bg-brand-forest text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl mb-14">
          <p className="text-sm uppercase tracking-widest opacity-70 mb-4">
            Whole body health starts in the gut.
          </p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            Formulations built on clinically-studied ingredients for sustained support.
          </h2>
          <a
            href="#all"
            className="inline-block mt-6 text-sm underline underline-offset-4 opacity-90 hover:opacity-100"
          >
            Shop all →
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <a
              key={p.code}
              href="#"
              className="group bg-brand-cream text-brand-forest rounded-3xl p-6 flex flex-col aspect-[3/4] hover:-translate-y-1 transition-transform"
            >
              <span className="text-xs uppercase tracking-wider opacity-70">{p.tag}</span>
              <div className="flex-1 flex items-center justify-center my-4">
                <img
                  src={capsuleMacro}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="w-40 h-40 object-contain"
                />
              </div>
              <div className="font-display text-2xl">{p.code}</div>
              <div className="text-sm opacity-80">{p.name}</div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="opacity-70">From ${p.price}/mo</span>
                <span className="rounded-full border border-brand-forest/30 px-3 py-1 group-hover:bg-brand-forest group-hover:text-brand-cream transition-colors">
                  Shop
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bundle() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <img
          src={duoJars}
          alt="Synbiotic and multivitamin jars"
          loading="lazy"
          width={1280}
          height={960}
          className="w-full rounded-3xl"
        />
        <div>
          <span className="inline-block rounded-full bg-brand-lime text-brand-forest px-3 py-1 text-xs mb-6">
            Bundle + Save 25%
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-brand-forest leading-tight">
            Daily essentials for nutrition and digestive health.
          </h2>
          <p className="mt-6 text-brand-forest/80 max-w-lg">
            Our clinically-studied daily synbiotic paired with a complete multivitamin to reduce
            bloat, support regularity, and cover everyday nutrient gaps.
          </p>
          <a
            href="#"
            className="inline-flex items-center mt-8 rounded-full bg-brand-forest text-primary-foreground px-7 py-3.5 text-sm font-medium hover:bg-brand-forest-deep transition-colors"
          >
            Shop the Daily Duo
          </a>
        </div>
      </div>
    </section>
  );
}

function ViaCap() {
  return (
    <section id="science" className="bg-brand-cream">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-widest text-brand-forest mb-4">
            ● ViaCap® Technology
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-brand-forest leading-tight">
            Most probiotics don't survive digestion. Ours do.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10 items-center">
          <div className="space-y-2 text-right">
            <h3 className="font-display text-2xl text-brand-forest">Outer Capsule</h3>
            <p className="text-sm text-brand-forest/75">
              Shields probiotics from stomach acid while delivering prebiotics to nourish beneficial
              bacteria along the way.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative aspect-square w-full max-w-sm rounded-full bg-background flex items-center justify-center">
              <img
                src={capsuleMacro}
                alt="Capsule cross section"
                loading="lazy"
                width={1024}
                height={1024}
                className="w-3/4 rotate-90"
              />
            </div>
          </div>
          <div className="space-y-2 text-left">
            <h3 className="font-display text-2xl text-brand-forest">Inner Capsule</h3>
            <p className="text-sm text-brand-forest/75">
              Delivers 24 live strains of probiotics directly to the colon — exactly where they're
              needed most.
            </p>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["38T", "microbes call you home"],
            ["24", "clinically-studied strains"],
            ["53.6B", "AFU per dose"],
            ["1M+", "members and counting"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-4xl text-brand-forest">{n}</div>
              <div className="text-xs uppercase tracking-wider text-brand-forest/70 mt-2">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MoreThanHuman() {
  return (
    <section id="learn" className="bg-brand-forest-deep text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-70 mb-4">Sprout 【 】</p>
          <h2 className="font-display text-5xl md:text-6xl leading-[1.05]">
            You are more than human.
          </h2>
          <p className="mt-6 opacity-85 max-w-lg">
            Your body isn't yours alone — it's home to 38 trillion microbes that power digestion,
            immunity, and more. Discover how their health shapes yours.
          </p>
          <a
            href="#"
            className="inline-flex items-center mt-8 rounded-full bg-brand-cream text-brand-forest px-7 py-3.5 text-sm font-medium hover:opacity-90"
          >
            ▶ Discover Microbiome 101
          </a>
        </div>
        <img
          src={lifestylePour}
          alt="Pouring capsules into hand"
          loading="lazy"
          width={1024}
          height={1280}
          className="w-full rounded-3xl"
        />
      </div>
    </section>
  );
}

function SeedLabs() {
  return (
    <section className="relative bg-brand-forest text-primary-foreground overflow-hidden">
      <img
        src={island}
        alt="Aerial view of remote island"
        loading="lazy"
        width={1600}
        height={900}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-32 text-center">
        <p className="text-xs uppercase tracking-widest mb-4">● Lipari, Panarea — Italy</p>
        <h2 className="font-display text-5xl md:text-6xl mb-6">SproutLabs</h2>
        <p className="max-w-xl mx-auto opacity-90">
          Because health is not just human. Pioneering microbial science for people, animals, and
          our planet.
        </p>
        <a
          href="#"
          className="inline-flex items-center mt-8 rounded-full bg-brand-cream text-brand-forest px-7 py-3.5 text-sm font-medium hover:opacity-90"
        >
          Read more
        </a>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-28 text-center">
        <h2 className="font-display text-5xl md:text-6xl text-brand-forest leading-[1.05]">
          Change your gut health for good.*
        </h2>
        <p className="mt-6 text-brand-forest/80">Feel lasting relief with SP-01®*</p>
        <a
          href="#shop"
          className="inline-flex items-center mt-10 rounded-full bg-brand-forest text-primary-foreground px-8 py-4 text-base font-medium hover:bg-brand-forest-deep transition-colors"
        >
          Shop now
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-forest-deep text-primary-foreground/80">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-4 gap-10 text-sm">
        <div>
          <div className="font-display text-2xl text-primary-foreground flex items-center gap-1.5">
            sprout <span className="inline-block w-2 h-2 rounded-full bg-brand-cream" />
          </div>
          <p className="mt-4 opacity-70 max-w-xs">
            Microbial science for whole-body health.
          </p>
        </div>
        {[
          ["Shop", ["Daily Synbiotic", "Multivitamin", "Energy + Focus", "Sleep + Restore"]],
          ["Science", ["Our Approach", "Studies", "Strains", "ViaCap®"]],
          ["Company", ["About", "SproutLabs", "Careers", "Contact"]],
        ].map(([title, items]) => (
          <div key={title as string}>
            <div className="text-primary-foreground font-medium mb-4">{title}</div>
            <ul className="space-y-2.5 opacity-80">
              {(items as string[]).map((i) => (
                <li key={i}>
                  <a href="#" className="hover:opacity-100">{i}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs opacity-60 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Sprout Health. All rights reserved.</span>
          <span>*These statements have not been evaluated by the FDA.</span>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <Products />
        <Bundle />
        <ViaCap />
        <MoreThanHuman />
        <SeedLabs />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
