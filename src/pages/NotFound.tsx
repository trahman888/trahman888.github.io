import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { profile } from "../data";
import ThemeToggle from "../components/ThemeToggle";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Page not found · {profile.name}</title>
      </Helmet>
      <div
        className="min-h-screen bg-white text-slate-900 flex flex-col"
        data-testid="not-found-page"
      >
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
            <a
              href="/"
              data-testid="nf-home-brand"
              className="text-sm font-semibold tracking-tight text-slate-900 hover:text-slate-700 transition-colors"
            >
              {profile.name}
              <span className="ml-2 text-slate-400 font-normal hidden sm:inline">
                · Research Scientist
              </span>
            </a>
            <div className="flex items-center gap-6">
              <a
                href="/"
                data-testid="nf-back-link"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={14} />
                Back to home
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-20 sm:py-28">
            <div className="grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  <span className="inline-block h-px w-8 bg-slate-300" />
                  Error 404
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]"
                  data-testid="nf-heading"
                >
                  Page not found.
                </h1>

                <p
                  className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
                  data-testid="nf-message"
                >
                  The URL{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[13px] text-slate-800 font-mono">
                    {typeof window !== "undefined" ? window.location.pathname : ""}
                  </code>{" "}
                  doesn&apos;t match any section of this site. It may have been
                  moved, mistyped, or never existed.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="/"
                    data-testid="nf-home-button"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                  >
                    <Home size={16} />
                    Return home
                  </a>
                  <a
                    href="/#research"
                    data-testid="nf-research-link"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    View research
                  </a>
                  <a
                    href={`mailto:${profile.emails[0]}`}
                    data-testid="nf-email-link"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    Email
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:flex items-center justify-center"
                aria-hidden="true"
              >
                <div
                  className="theme-fixed relative aspect-square w-[260px] lg:w-[300px] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.18]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
                      backgroundSize: "12px 12px",
                    }}
                  />
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
                    style={{
                      background:
                        "radial-gradient(circle, #ffffff 0%, transparent 60%)",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-white font-bold tracking-tighter"
                      style={{ fontSize: "120px", lineHeight: 1 }}
                    >
                      404
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-200 py-6">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} {profile.name}.
            </p>
            <p>
              Lost?{" "}
              <a
                href="/"
                className="text-slate-700 hover:text-slate-900 underline underline-offset-4 decoration-slate-300"
              >
                Start from the top
              </a>
              .
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
