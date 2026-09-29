// Add news items in reverse chronological order (newest first).

import type { NewsItem } from "../lib/types";

export const news: NewsItem[] = [
  {
    date: "September 2026",
    title: "Two Papers accepted at NeurIPS 2026",
  },
  {
    date: "July 2026",
    title: "Paper accepted at ECCVW 2026",
  },
  {
    date: "Jan 2026",
    title: "Paper accepted at ICLR 2026",
  },
  {
    date: "Apr 2025",
    title: "Paper accepted at CRV 2025 as Oral",
  },
  {
    date: "Mar 2025",
    title: "Paper submitted to ICCV 2025",
  },
  {
    date: "Jan 2025",
    title: "Organizing workshop at CVPR 2025",
    description:
      "Co-organizing the \"PixFoundation: A Benchmark and Workshop for Pixel-level Foundation Models\" workshop at CVPR 2025.",
    link: {
      label: "Workshop website",
      url: "https://sites.google.com/view/pixfoundation",
    },
  },
  {
    date: "May 2024",
    title: "Joined the Vector Institute",
    description: "Began postdoctoral research at the [Vector Institute for AI](https://vectorinstitute.ai/), working with Profs. [Leonid Sigal](https://www.cs.ubc.ca/~lsigal/) and [Renjie Liao](https://lrjconan.github.io/).",
  },
  {
    date: "2024",
    title: "Paper accepted at CVPR 2024",
  },
  {
    date: "2023",
    title: "Paper accepted at CVPR 2023",
  },
];