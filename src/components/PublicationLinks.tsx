import { BookOpen, ExternalLink, FileText, Youtube } from "lucide-react";
import type { Publication } from "../lib/types";

export function PublicationLinks({
  publication,
  idx
}: {
  publication: Publication;
  idx: number;
}) {
  const {links} = publication;
  return Object.keys(links || {}).length > 0 && (
    <div className="pub-links flex flex-wrap items-center gap-2 mt-3 sm:mt-2" data-testid={`pub-links-${idx}`}>
      {Object.entries(links).map(([label, url]) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noreferrer"
          data-testid={`pub-link-${idx}-${label.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-md px-2.5 py-1 transition-colors"
        >
          {label === "PDF" ? (
            <FileText size={12} />
          ) : label === "arXiv" ? (
            <BookOpen size={12} />
          ) : label === "Video" ? (
            <Youtube size={12} />
          ) : (
            <ExternalLink size={12} />
          )}
          {label}
        </a>
      ))}
    </div>
  );
}