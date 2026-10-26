// Type definitions for the profile, news and publications data structures.
// These types are used across the site for type safety and autocompletion.

export interface Affiliation {
  role: string;
  org: string;
  current?: boolean;
}

export interface Profile {
  name: string;
  title: string;
  institution: string;
  url: string;
  affiliations: Affiliation[];
  photo: string;
  initials: string;
  about: string[];
  researchInterests: string[];
  emails: string[];
  links: {
    googleScholar?: string;
    linkedin?: string;
    oldSite?: string;
    cv?: string;
    [key: string]: string | undefined; // for any additional links
  };
}

export interface NewsItem {
  date: string;
  title: string;
  description?: string;
  link?: {
    label: string;
    url: string;
  };
}

export interface Award {
  title: string;
  date?: string;
  organization?: string;
  description?: string;
  declined?: boolean;
}

interface PublicationSectionBlockHeroGrid {
  type: "hero-grid";
  left: string[];
  rightPlaceholder: string;
}

interface PublicationSectionBlockText {
  type: "text";
  text: string;
}

interface PublicationSectionBlockList {
  type: "list";
  items?: string[];
}

interface PublicationSectionBlockGallery {
  type: "gallery";
  items?: {
    title: string;
    description: string;
  }[];
}

interface PublicationSectionBlockComparison {
  type: "comparison";
  columns?: {
    title: string;
    items?: string[];
  }[];
}

export type PublicationSectionBlock =
  | PublicationSectionBlockHeroGrid
  | PublicationSectionBlockText
  | PublicationSectionBlockList
  | PublicationSectionBlockGallery
  | PublicationSectionBlockComparison;

export interface PublicationSection {
  id: string;
  navLabel: string;
  pill: string;
  title: string;
  blocks?: PublicationSectionBlock[];
  // ... keep the rest of sections (method, figures, comparison, applications, limitations)
}

export interface PublicationPageContent {
  seo?: {
    title: string;
    description: string;
  };
  header?: {
    title: string;
    tagline?: string;
    paper?: string;
  };
  sections?: PublicationSection[];
  footer?: {
    text: string;
  }
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  venueShort: string; // e.g. "CVPR" instead of "IEEE Conference on Computer Vision and Pattern Recognition"
  year: number;
  categories: PublicationCategory[];
  image?: string; // optional field for publication thumbnail
  links: {
    [key: string]: string; // e.g. { arXiv: "url", PDF: "url" }
  };
  pageContent?: PublicationPageContent | null; // optional field for abstract, bibtex, etc. to be shown on publication page
}

// Publication category as enum for better type safety in filtering and display.
export enum PublicationCategory {
  VisionLanguage = "Vision-Language Models",
  GenerativeAI = "Generative AI",
  MultimodalLearning = "Multimodal Learning",
  ComputerVision = "Computer Vision",
  MachineLearning = "Machine Learning",
  Other = "Other",
}

export type PerYearStats = {
  year: number;
  value: number;
};

export type PerYearCount = {
  year: number;
  count: number;
};

export type CitationTotals = {
  citations: number;
  citationsSince: PerYearStats;
  hIndex: number;
  hIndexSince: PerYearStats;
  i10Index: number;
  i10IndexSince: PerYearStats;
};

export interface Scholar {
  profileUrl: string;
  lastUpdate: string;
  totals: CitationTotals;
  perYear: PerYearCount[];
}

export type Stats = { key: keyof CitationTotals; label: string };

export type Notice = {
  id: string;
  title: string;
  message: string;
  color: string;
  startDate: string;
  endDate: string;
  pinned: boolean;
};

interface OrganizationSchema {
  "@type": "Organization";
  name: string;
}

interface EducationalOrganizationSchema {
  "@type": "EducationalOrganization";
  name: string;
  description?: string;
}

export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  jobTitle?: string;
  url?: string;
  sameAs?: (string | undefined)[];
  image?: string;
  worksFor?: OrganizationSchema;
  alumniOf?: EducationalOrganizationSchema[];
  knowsAbout?: string[];
}