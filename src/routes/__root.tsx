import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { PromoPopup } from "@/components/PromoPopup";
import { AgeGate } from "@/components/AgeGate";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { ClarumAuthProvider } from "@/lib/clarum-auth";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Clarum — Batch-Tested Research Peptides" },
      {
        name: "description",
        content:
          "Independently tested research peptides with full COAs. Every batch verified by ISO-accredited labs. Free U.S. shipping over $150.",
      },
      { name: "author", content: "Clarum Peptides" },
      { name: "google-site-verification", content: "ae0hIMBxZwn8c3qXOrzHE8_B_ISHPQJRjm_fi4bOItY" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Clarum Peptides" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Clarum — Batch-Tested Research Peptides" },
      { name: "twitter:title", content: "Clarum — Batch-Tested Research Peptides" },
      { name: "description", content: "Independently lab-tested research peptides with full COAs for every batch. Identity, purity, heavy metals — verified, never assumed. Nothing hidden." },
      { property: "og:description", content: "Independently lab-tested research peptides with full COAs for every batch. Identity, purity, heavy metals — verified, never assumed. Nothing hidden." },
      { name: "twitter:description", content: "Independently lab-tested research peptides with full COAs for every batch. Identity, purity, heavy metals — verified, never assumed. Nothing hidden." },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@100..900&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
    scripts: [
      { src: "https://integrate.depay.com/widgets/v13.js" },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Clarum Peptides",
          url: "https://clarumpeptides.com",
          logo: "https://clarumpeptides.com/favicon.png",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Clarum Peptides",
          url: "https://clarumpeptides.com",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ClarumAuthProvider>
      <CartProvider>
        <AgeGate />
        <Outlet />
        <PromoPopup />
        <CartDrawer />
        <Toaster />
      </CartProvider>
    </ClarumAuthProvider>
  );
}

