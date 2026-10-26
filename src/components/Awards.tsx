import { motion } from "framer-motion";
import { awards } from "../data";
import type { Award } from "../lib/types";

const getAwardYear = (award: Award) =>
  Number(award.date?.match(/\d{4}/)?.[0] ?? 0);

const chronologicalAwards = [...awards].sort(
  (a, b) => getAwardYear(b) - getAwardYear(a),
);

export default function Awards() {
  return (
    <section
      id="awards"
      className="py-20 sm:py-28 border-t border-slate-100 bg-slate-50/40"
      data-testid="awards-section"
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
            <span className="text-slate-400">04</span>
            <span className="inline-block h-px w-8 bg-slate-300" />
            Awards &amp; Honors
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Recognition &amp; scholarships
          </h2>
        </motion.div>

        <ol className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {chronologicalAwards.map((award, idx) => (
            <motion.li
              key={`${award.title}-${award.date ?? "undated"}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
              className="flex items-start gap-4 py-3 sm:gap-6"
              data-testid={`award-item-${idx}`}
            >
              <time className="w-24 shrink-0 pt-0.5 text-xs font-medium tabular-nums text-slate-500 sm:w-32">
                {award.date ?? "Undated"}
              </time>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                  {award.title}
                </h3>
                {award.organization && (
                  <p className="mt-0.5 text-sm text-slate-600">
                    {award.organization}
                  </p>
                )}
                {award.description && (
                  <p className="mt-0.5 text-sm text-slate-600">
                    {award.description}
                  </p>
                )}
                {award.declined && (
                  <span className="mt-1.5 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                    Declined
                  </span>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
