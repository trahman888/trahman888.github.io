// A stable hue per publication (based on title hash) for subtle variety

import { clearRich } from "../lib/richTextUtils";
import type { Publication } from "../lib/types";

// without ever drifting from the slate palette.
function hashHue(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function PublicationThumb({ pub, idx, shape = "square" }: { pub: Publication; idx: number; shape?: "square" | "landscape" }) {
  // If a real image is provided, render it.
  if (pub.image) {
    return (
      <div
        className={`pub-thumb relative w-full aspect-[16/9] ${shape === "square" ? "sm:w-28 sm:h-28 md:w-32 md:h-32" : "sm:aspect-landscape"} flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100`}
        data-testid={`pub-thumb-${idx}`}
      >
        <img
          src={pub.image ? pub.image.startsWith("http") ? pub.image : `/${pub.image}` : ""}
          alt={clearRich(pub.title)}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  // Otherwise, render a tasteful placeholder. Uses the venue acronym
  // (e.g. CVPR, NeurIPS, ICCV) and a subtle deterministic accent.
  const acronym = (pub.venue || "PUB")
    .replace(/preprint/i, "arXiv")
    .replace(/workshop/i, "Wkshp")
    .trim();

  const palettes = [
    { from: "#0F172A", to: "#1E293B" }, // slate
    { from: "#111827", to: "#1F2937" }, // gray
    { from: "#1E293B", to: "#334155" }, // slate light
    { from: "#0B1220", to: "#1E293B" }, // deep slate
  ];
  const p = palettes[hashHue(pub.title + pub.year) % palettes.length];

  return (
    <div
      className="theme-fixed pub-thumb relative w-full sm:w-28 sm:h-28 md:w-32 md:h-32 aspect-[16/9] sm:aspect-square flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
      style={{
        backgroundImage: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`,
      }}
      data-testid={`pub-thumb-placeholder-${idx}`}
      aria-hidden="true"
    >
      {/* dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "10px 10px",
        }}
      />
      {/* corner gloss */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 60%)" }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
        <span className="text-white font-bold tracking-tight text-base sm:text-[15px] md:text-base leading-none">
          {acronym}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-300 font-medium">
          {pub.year}
        </span>
      </div>

      {/* bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
    </div>
  );
}