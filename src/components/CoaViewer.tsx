import { useState } from "react";
import { Download, ExternalLink, X, ZoomIn } from "lucide-react";
import type { CoaRecord } from "@/data/coaLibrary";

/**
 * Renders the complete supplier certificate document, page by page, exactly as
 * issued. No redrawing, no cropping — page images are straight renders of the
 * signed PDF, with the original verification page and PDF as fallbacks.
 */
export function CoaDocument({
  record,
  productLabel,
}: {
  record: CoaRecord;
  productLabel: string;
}) {
  const [lightboxPage, setLightboxPage] = useState<number | null>(null);

  return (
    <div>
      <div className="space-y-3">
        {record.pages.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightboxPage(i)}
            className="group/img relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-white cursor-zoom-in"
          >
            <img
              src={src}
              alt={`${productLabel} — Certificate of Analysis, batch ${record.batch}, page ${i + 1} of ${record.pages.length}`}
              loading="lazy"
              className="w-full h-auto"
            />
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/75 text-white text-xs font-medium px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-1.5">
              <ZoomIn className="h-3.5 w-3.5" />
              Page {i + 1} of {record.pages.length} — tap to enlarge
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={record.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 text-brand-gold text-xs font-medium px-4 py-2 hover:bg-brand-gold/10 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open original verification page
        </a>
        <a
          href={record.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 text-foreground/70 text-xs font-medium px-4 py-2 hover:border-white/30 hover:text-foreground transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Download signed PDF
        </a>
      </div>

      {lightboxPage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
          onClick={() => setLightboxPage(null)}
        >
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/10">
            <span className="text-foreground text-xs sm:text-sm font-medium truncate">
              {productLabel} — Batch {record.batch}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={record.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-brand-gold hover:text-brand-gold-light"
              >
                <Download className="h-3.5 w-3.5" /> PDF
              </a>
              <button
                type="button"
                onClick={() => setLightboxPage(null)}
                className="p-2 rounded-full hover:bg-white/10 text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div
            className="flex-1 overflow-auto p-3 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {record.pages.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${productLabel} certificate page ${i + 1}`}
                className="mx-auto w-full max-w-3xl h-auto rounded-xl bg-white"
                ref={
                  i === lightboxPage
                    ? (el) => el?.scrollIntoView({ block: "start" })
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CoaPendingPanel({ sku, productName }: { sku: string; productName: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] px-6 py-10 text-center">
      <p className="text-sm text-foreground/60">Report pending</p>
      <p className="mt-1 text-xs text-foreground/40">
        {productName} ({sku}) is listed in the supplier library with no published certificate yet.
      </p>
    </div>
  );
}

export function CoaUnavailablePanel() {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] px-6 py-10 text-center">
      <p className="text-sm text-foreground/60">Current report unavailable</p>
      <p className="mt-1 text-xs text-foreground/40">
        No matching current supplier certificate was found for this item.
      </p>
    </div>
  );
}
