import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { news } from "../data";
import { RichText } from "./ui/RichText";
import { INITIAL_VISIBLE_NEWS } from "../lib/constants";



export default function News() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_NEWS);
  const visibleNews = news.slice(0, visibleCount);
  const hasMoreNews = news.length > visibleCount;

  const handleToggleNews = () => {
    if (hasMoreNews) {
      setVisibleCount((prev) => Math.min(prev + INITIAL_VISIBLE_NEWS, news.length));
      return;
    }

    setVisibleCount(INITIAL_VISIBLE_NEWS);
  };

  return (
    <section
      id="news"
      className="py-20 sm:py-28 border-t border-slate-100"
      data-testid="news-section"
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
            <span className="text-slate-400">02</span>
            <span className="inline-block h-px w-8 bg-slate-300" />
            Recent News
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Updates &amp; highlights
          </h2>
        </motion.div>

        <ol
          className="mt-12 relative border-l border-slate-200 ml-2 sm:ml-3"
          data-testid="news-timeline"
        >
          {visibleNews.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="mb-10 ml-6 sm:ml-8 group last:mb-0"
              data-testid={`news-item-${idx}`}
            >
              <span className="absolute w-3 h-3 bg-white border-2 border-slate-300 rounded-full -left-[6.5px] mt-1.5 group-hover:border-slate-900 transition-colors" />
              <time className="block text-xs font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                {item.date}
              </time>
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                <RichText>{item.title}</RichText>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mt-1.5">
                <RichText>{item.description}</RichText>
              </p>
              {item.link && (
                <a
                  href={item.link.url}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`news-link-${idx}`}
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-md px-2.5 py-1 transition-colors"
                >
                  <ExternalLink size={12} />
                  {item.link.label}
                </a>
              )}
            </motion.li>
          ))}
          <li className="mb-10 ml-6 sm:ml-8 group h-0">
            <span className="absolute w-3 h-3 bg-white border-2 border-slate-300 rounded-full -left-[6.5px] group-hover:border-slate-900 transition-colors" />
            <button
              type="button"
              onClick={handleToggleNews}
              className="rounded-full border border-slate-300 bg-white cursor-pointer px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 -mt-4"
              aria-expanded={visibleCount >= news.length}
            >
              {hasMoreNews ? "Show more" : "Show less"}
            </button>
          </li>
        </ol>
      </div>
    </section>
  );
}