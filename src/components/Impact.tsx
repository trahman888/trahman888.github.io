import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { fetchScholar } from "../data";
import type { CitationTotals, PerYearCount, PerYearStats, Scholar, Stats } from "../lib/types";
import { useEffect, useState } from "react";
import { useTheme } from "../contexts/theme-context";

// Recharts takes literal colors, so the chart palette is picked per theme.
const CHART_COLORS = {
  light: {
    grid: "#E2E8F0",
    tickX: "#64748B",
    tickY: "#94A3B8",
    cursor: "rgba(15, 23, 42, 0.04)",
    tooltipBg: "#FFFFFF",
    tooltipBorder: "#E2E8F0",
    tooltipShadow: "0 4px 16px -8px rgba(15,23,42,0.12)",
    label: "#0F172A",
    item: "#000000", // recharts' previous default — keeps light mode unchanged
    barCurrent: "#0F172A",
    bar: "#1E293B",
  },
  dark: {
    grid: "#1E293B",
    tickX: "#94A3B8",
    tickY: "#64748B",
    cursor: "rgba(241, 245, 249, 0.06)",
    tooltipBg: "#0F172A",
    tooltipBorder: "#334155",
    tooltipShadow: "0 4px 16px -8px rgba(0,0,0,0.6)",
    label: "#F1F5F9",
    item: "#CBD5E1",
    barCurrent: "#F1F5F9",
    bar: "#CBD5E1",
  },
} as const;

const formatNum = (n: number) => n.toLocaleString("en-US");

const stats: Stats[] = [
  { key: "citations", label: "Citations" },
  { key: "hIndex", label: "h-index" },
  { key: "i10Index", label: "i10-index" },
];

export default function Impact() {
  const [scholarData, setScholarData] = useState<Scholar | null>(null);
  const currentYear = new Date().getFullYear();
  const colors = CHART_COLORS[useTheme().theme];

  useEffect(() => {
    fetchScholar()
      .then(setScholarData)
      .catch((error) => {
        console.error("Scholar fetch failed:", error);
      });
  }, []);

  const scholar = scholarData;
  const data: PerYearCount[] = scholar?.perYear || [];

  return scholar ? (
    <section
      id="impact"
      className="py-20 sm:py-28 border-t border-slate-100"
      data-testid="impact-section"
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
            <span className="text-slate-400" aria-label="Featured">&#9733;</span>
            <span className="inline-block h-px w-8 bg-slate-300" />
            Impact
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Citations &amp; reach
              <small className="block text-sm font-normal text-slate-500 mt-1">
                Updated on {new Date(scholar.lastUpdate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric"
                })}
              </small>
            </h2>
            <a
              href={scholar.profileUrl}
              target="_blank"
              rel="noreferrer"
              data-testid="impact-scholar-link"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-md px-3 py-1.5 transition-colors w-fit"
            >
              <ExternalLink size={13} />
              View on Google Scholar
            </a>
          </div>
        </motion.div>

        <div
          className="mt-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-10 items-stretch"
          data-testid="impact-grid"
        >
          {/* Metric cards */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3" data-testid="impact-stats">
            {stats.map(({ key, label }) => {
              const total = scholar.totals[key] as number;
              const since = scholar.totals[`${key}Since` as keyof CitationTotals] as PerYearStats;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45 }}
                  className="border border-slate-200 rounded-xl bg-white p-4 sm:p-5 flex flex-col gap-1"
                  data-testid={`impact-stat-${key}`}
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] font-medium text-slate-500">
                    {label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {formatNum(total)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formatNum(since.value)} since {since.year}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Chart card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="border border-slate-200 rounded-xl bg-white p-4 sm:p-6"
            data-testid="impact-chart-card"
          >
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-sm font-semibold text-slate-900">
                Citations per year
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                {data[0].year} – {data[data.length - 1].year}
              </p>
            </div>
            <div className="h-56 sm:h-64 w-full" data-testid="impact-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
                  barCategoryGap={4}
                >
                  <CartesianGrid
                    stroke={colors.grid}
                    strokeDasharray="2 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: colors.tickX, fontSize: 11 }}
                    interval={1}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: colors.tickY, fontSize: 11 }}
                    width={44}
                  />
                  <Tooltip
                    cursor={{ fill: colors.cursor }}
                    contentStyle={{
                      borderRadius: 8,
                      border: `1px solid ${colors.tooltipBorder}`,
                      backgroundColor: colors.tooltipBg,
                      boxShadow: colors.tooltipShadow,
                      fontSize: 12,
                      padding: "8px 10px",
                    }}
                    labelStyle={{ color: colors.label, fontWeight: 600 }}
                    // Bar colors come from <Cell>, so recharts falls back to #000 for item text.
                    itemStyle={{ color: colors.item }}
                    formatter={(value) => [`${value} citations`, ""]}
                    separator=""
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.map((d) => (
                      <Cell
                        key={d.year}
                        fill={d.year === currentYear ? colors.barCurrent : colors.bar}
                        fillOpacity={d.year === currentYear ? 1 : 0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Source: Google Scholar. Current year is partial.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  ) : null;
}