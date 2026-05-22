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
      { title: "C Research Peptides" },
      {
        name: "description",
        content:
          "Analytically tested research peptides with full 5-panel independent lab testing. Every batch documented. For in vitro laboratory research use only.",
      },
      { name: "author", content: "Clarum" },
      { property: "og:title", content: "C Research Peptides" },
      {
        property: "og:description",
        content:
          "Full-panel tested research peptides. Every batch ships with a public Certificate of Analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "C Research Peptides" },
      { name: "description", content: "Clarum is a website that replicates the design and functionality of seed.com, showcasing product information and scientific data." },
      { property: "og:description", content: "Clarum is a website that replicates the design and functionality of seed.com, showcasing product information and scientific data." },
      { name: "twitter:description", content: "Clarum is a website that replicates the design and functionality of seed.com, showcasing product information and scientific data." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a75daf3e-744d-45dd-91d0-6f418bb793d8/id-preview-55250ded--c6f60515-8207-4bdd-b760-76cddc5ccb61.lovable.app-1777184128274.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a75daf3e-744d-45dd-91d0-6f418bb793d8/id-preview-55250ded--c6f60515-8207-4bdd-b760-76cddc5ccb61.lovable.app-1777184128274.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      { src: "https://integrate.depay.com/widgets/v13.js" },
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

