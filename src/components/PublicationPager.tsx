import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Publication } from "../lib/types";
import { getAdjacentPublicationPages } from "../lib/utils";
import { clearRich } from "../lib/richTextUtils";

function PagerCard({ publication, direction }: { publication: Publication; direction: "previous" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      to={`/publications/${publication.id}`}
      rel={isNext ? "next" : "prev"}
      data-testid={`pub-pager-${direction}`}
      className={[
        "group flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 transition-colors hover:border-slate-300",
        isNext ? "sm:col-start-2 sm:items-end sm:text-right" : "",
      ].join(" ")}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 group-hover:text-slate-900 transition-colors">
        {!isNext && <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />}
        {isNext ? "Next" : "Previous"}
        {isNext && <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />}
      </span>
      <span className="text-sm sm:text-base font-semibold leading-snug text-slate-900 line-clamp-2">
        {clearRich(publication.title)}
      </span>
      <span className="text-xs text-slate-500">
        {publication.venueShort} · {publication.year}
      </span>
    </Link>
  );
}

/** Previous / next links between publication detail pages. Renders nothing if there are none. */
export default function PublicationPager({ publicationId }: { publicationId: string }) {
  const { previous, next } = getAdjacentPublicationPages(publicationId);
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="More publications"
      className="mt-12 pt-8 border-t border-slate-200 grid gap-4 sm:grid-cols-2"
      data-testid="pub-pager"
    >
      {previous && <PagerCard publication={previous} direction="previous" />}
      {next && <PagerCard publication={next} direction="next" />}
    </nav>
  );
}
