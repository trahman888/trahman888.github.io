import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { publications, publicationCategories } from "../data/publications";
import { clearTextLinks } from "../lib/richTextUtils";
import { RichText } from "./ui/RichText";
import { Link } from "react-router-dom";
import { formatAuthors, isAllowPublicationPage, isFirstAuthor } from "../lib/utils";
import { PublicationThumb } from "./PublicationThumb";
import { PublicationLinks } from "./PublicationLinks";
import type { PublicationCategory } from "../lib/types";
import { GOOGLE_SCHOLAR_AUTHOR_ID } from "../lib/constants";

export default function Publications() {
  const [filter, setFilter] = useState<"All" | PublicationCategory>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return publications;
    return publications.filter((p) => p.categories.includes(filter));
  }, [filter]);

  const isAllowPage = isAllowPublicationPage();

  return (
    <section
      id="research"
      className="py-20 sm:py-28 border-t border-slate-100 bg-slate-50/40"
      data-testid="publications-section"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            <span className="text-slate-400">03</span>
            <span className="inline-block h-px w-8 bg-slate-300" />
            Research
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Selected publications
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
            Peer-reviewed work in computer vision, multimodal learning, and
            generative AI. Filter by topic, or view{" "}
            <a
              href={`https://scholar.google.com/citations?user=${GOOGLE_SCHOLAR_AUTHOR_ID}&hl=en`}
              target="_blank"
              rel="noreferrer"
              className="text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors"
              data-testid="pubs-scholar-link"
            >
              the full list on Google Scholar
            </a>
            .
          </p>
        </motion.div>

        {/* Filters */}
        <div
          className="mt-10 flex flex-wrap gap-2"
          data-testid="publication-filters"
        >
          {publicationCategories.map((cat) => {
            const c = cat as "All" | PublicationCategory;
            const isActive = c === filter;
            return (
              <button
                key={cat}
                onClick={() => setFilter(c)}
                data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium border cursor-pointer transition-colors ${isActive
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="mt-10 flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((pub, idx) => {
              const hasFirstAuthor = isFirstAuthor(pub);

              return (
                <motion.article
                  layout
                  key={`${pub.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className={`publication-card group relative flex flex-col sm:flex-row gap-5 sm:gap-6 border bg-white rounded-xl p-5 sm:p-6 hover:-translate-y-[1px] transition-all duration-200 ${hasFirstAuthor
                    ? "border-amber-300 sm:border-l-4 sm:border-t-0 sm:border-r-0 sm:border-b-0"
                    : "border-slate-200 hover:border-slate-300"
                    }`}
                  data-testid={`publication-card-${idx}`}
                >
                  <PublicationThumb pub={pub} idx={idx} />

                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="popup inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-900 text-white tracking-wide"
                        data-testid={`pub-venue-${idx}`}
                        data-title={pub.venue}
                      >
                        {pub.venueShort}
                      </span>
                      {hasFirstAuthor && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-800">
                          First author
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">
                        {pub.year}
                      </span>
                      {filter !== "All" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                          {filter}
                        </span>
                      ) : pub.categories.map((cat, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                          {cat}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug tracking-tight">
                      {hasFirstAuthor && isAllowPage ? (
                        <Link to={`/publications/${pub.id}`} rel="noreferrer" className="hover:underline">
                          <RichText>{clearTextLinks(pub.title)}</RichText>
                        </Link>
                      ) : (
                        <RichText>{pub.title}</RichText>
                      )}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      <RichText>{formatAuthors(pub.authors)}</RichText>
                    </p>

                    <PublicationLinks publication={pub} idx={idx} />
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-sm text-slate-500" data-testid="no-pubs-msg">
              No publications match this filter.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}