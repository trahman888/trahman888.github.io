import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { UserCheck } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NoticeBar from "../components/NoticeBar";
import Section from "../components/Section";
import Publications from "../components/Publications";
import { formatAuthors, getPublicationContent } from "../lib/utils";
import { RichText } from "../components/ui/RichText";
import { PublicationLinks } from "../components/PublicationLinks.tsx";
import { useCompressed } from "../contexts/compress-context.ts";
import type { Publication } from "../lib/types";

export default function Publication() {
  const { publicationId } = useParams();
  const publication = publicationId ? getPublicationContent(publicationId) : null;
  const { seo, header, sections, footer } = publication?.pageContent || {};
  const [activeSectionId, setActiveSectionId] = useState<string>(sections?.[0]?.id || "");
  const title = `${(seo?.title || publication?.title || "Publication")} · ${publication?.venue || 'Venue'} (${publication?.year || 'Year'})`;
  const { compressed } = useCompressed();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="App min-h-screen bg-white text-slate-900 antialiased">
      <NoticeBar />
      <Navbar page="publication" />
      <main>
        {publication?.pageContent ? (
          <>
            <Helmet>
              <title>{title}</title>
              <meta name="description" content={seo?.description || "Publication details"} />
              {seo?.title && <meta property="og:title" content={seo.title} />}
              {seo?.description && (
                <meta property="og:description" content={seo.description} />
              )}
              <meta property="og:type" content="website" />
            </Helmet>
            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
              <header className="flex flex-col gap-4 mb-8 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="popup inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-900 text-white tracking-wide"
                    data-testid={`pub-venue-${publicationId}`}
                    data-title={publication?.venue}
                  >
                    {compressed ? publication?.venueShort : publication?.venue}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {publication?.year}
                  </span>
                  {publication?.categories.map((cat, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="title-block">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">{header?.title}</h1>
                  {header?.tagline && (
                    <p className="text-base text-slate-600 leading-relaxed max-w-2xl">{header.tagline}</p>
                  )}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <UserCheck size={14} className="inline-block mr-1" />
                    <RichText>{formatAuthors(publication?.authors)}</RichText>
                  </p>
                </div>
                <div className="text-[0.9rem]">
                  <PublicationLinks publication={publication} idx={0} />
                </div>
              </header>

              {/* Nav → sets activeSectionId, no href / scroll */}
              <nav className={[
                "my-4 mb-8 py-2 border-b border-slate-300 sticky bg-white z-10",
                compressed ? "top-12" : "top-16",
              ].join(" ")}>
                <div className="flex flex-wrap gap-2">
                  {sections?.map((section) => {
                    const isActive = section.id === activeSectionId;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSectionId(section.id)}
                        className={[
                          "inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium border cursor-pointer transition-colors",
                          isActive
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900",
                        ].join(" ")}
                      >
                        {section.navLabel || section.title}
                      </button>
                    );
                  })}
                </div>
              </nav>

              <main className="flex flex-col gap-8">
                {(sections || []).map((section) => (
                  <Section key={section.id} publication={publication} section={section} visible={section.id === activeSectionId} />
                ))}
              </main>

              <footer className="mt-8 text-[0.8rem] text-pageMuted text-center">
                {footer?.text}
              </footer>
            </div>
          </>
        ) : publicationId ? (
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
            <h1 className="text-3xl font-bold mb-4">Publication not found</h1>
            <p className="text-gray-700 dark:text-slate-600">The requested publication could not be found.</p>
          </div>
        ) : (
          <Publications />
        )}
        <Footer />
      </main>
    </div>
  );
}