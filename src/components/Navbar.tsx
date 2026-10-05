import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Maximize2, Minimize2 } from "lucide-react";
import { profile } from "../data";
import { useCompressed } from "../contexts/compress-context.ts";

const SECTIONS: { id: string; label: string }[] = [
  { id: "about", label: "About" },
  { id: "news", label: "News" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ page }: { page?: string }) {
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);

  const loc = useLocation();
  const { compressed, toggleCompressed } = useCompressed();

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  // get hash id from url and set to scroll to that section, otherwise scroll to top
  useEffect(() => {
    const hash = loc.hash.slice(1);

    if (hash) {
      // A small timeout ensures elements are rendered and heights are calculated
      const timer = setTimeout(() => scrollTo(hash), 100);
      return () => clearTimeout(timer);
    } else {
      // Fulfills your comment requirement: scroll to top if no hash
      scrollTo('top');
    }
  }, [loc.hash, scrollTo]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-slate-200"
      data-testid="site-navbar"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <button
          onClick={() => {
            scrollTo("top");
            setOpen(false);
          }}
          className="text-sm font-semibold tracking-tight text-slate-900 hover:text-slate-700 transition-colors"
          data-testid="nav-home-link"
        >
          {profile.name}
          <span className="ml-2 text-slate-400 font-normal hidden sm:inline">
            · Research Scientist
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {page !== "publication" ? SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                scrollTo(s.id);
                setOpen(false);
              }}
              data-testid={`nav-${s.id}-link`}
              className={`text-sm font-medium transition-colors ${active === s.id
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-900"
                }`}
            >
              {s.label}
              {active === s.id && (
                <span className="block h-px bg-slate-900 mt-1" />
              )}
            </button>
          )) : SECTIONS.map((s) => (
            <Link key={s.id} to={`/#${s.id}`} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              {s.label}
            </Link>
          ))}
          <button
            onClick={toggleCompressed}
            className="flex items-center justify-center w-10 h-10 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
            aria-pressed={compressed}
            title={compressed ? "Disable compact view" : "Enable compact view"}
          >
            {compressed ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
        </nav>

        <button
          className="md:hidden p-2 -mr-2 rounded-md hover:bg-slate-100 text-slate-700"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          data-testid="nav-mobile-toggle"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 6h14" strokeLinecap="round" />
                <path d="M3 10h14" strokeLinecap="round" />
                <path d="M3 14h14" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white" data-testid="nav-mobile-menu">
          <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col">
            {page !== "publication" ? SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  scrollTo(s.id);
                  setOpen(false);
                }}
                data-testid={`nav-mobile-${s.id}-link`}
                className={`text-left py-3 text-sm font-medium border-b border-slate-100 last:border-0 ${active === s.id ? "text-slate-900" : "text-slate-600"
                  }`}
              >
                {s.label}
              </button>
            )) : SECTIONS.map((s) => (
              <Link key={s.id} to={`/#${s.id}`} className="text-left py-3 text-sm font-medium border-b border-slate-100 last:border-0 text-slate-600 hover:text-slate-900 transition-colors">
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}