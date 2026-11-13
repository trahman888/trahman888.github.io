# Tanzila Rahman — Academic Portfolio PRD

## Original problem statement
Build a modern academic portfolio website for Tanzila Rahman (Senior Research Scientist) to replace her outdated Google Sites page. Static React SPA, content stored in plain data files so a developer can edit without touching UI. Deployable to GitHub Pages. Sections: Hero, About, Publications/Research, Recent News, Contact. Linear/Google Scholar aesthetic, light mode, navy/slate accents, DM Sans, sleek 1px-bordered cards.

## User personas
- Academic peers & potential collaborators looking for her research areas
- Hiring/admissions committees evaluating her record
- Students/researchers searching for specific papers

## Architecture (current)
- Frontend only: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + framer-motion + lucide-react + recharts
- Routing via react-router-dom v7 (`/`, `/publications`, `/publications/:publicationId`). SEO via react-helmet-async and JSON-LD `Person` schema. Analytics via react-ga4.
- No backend or database. Content lives in `src/data/*.ts` (profile, publications, authors, news, awards, notice), and explainer pages are JSON in `src/data/page-publications/`.
- Citation metrics are in `public/data/scholar.json`, regenerated weekly by `scripts/scrape_scholar.py` (GitHub Actions) and fetched at runtime.
- Deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Implemented
### Initial version (2025-12)
- Hero with name, title, Huawei Canada affiliation, Google Scholar / Email / LinkedIn CTAs
- About section with bio, research-interest tags, affiliations sidebar
- Publications: venue badge, year, authors, category chips, link buttons; category filters
- News: vertical timeline
- Dark contact footer with emails, Scholar/LinkedIn/Mail buttons, copyright, previous-site link
- Light theme, DM Sans, slate-200 1px borders, no heavy shadows
- Mobile responsive with hamburger menu; interactive elements have `data-testid`

### Since then
- Migrated from CRA + JS to Vite + TypeScript, and from Tailwind 3 to Tailwind 4
- Real profile photo (`public/images/`) and hosted CV (`public/tanzila_rahman_resume.pdf`)
- Impact section: citation totals and per-year chart (recharts) from `scholar.json`, plus a weekly scrape workflow
- Awards section
- Publication thumbnails, `venueShort` labels, co-author homepage auto-linking (`authors.ts`), first-author name bolding
- Per-publication explainer pages (behind `VITE_SHOW_PUBLICATION_PAGE`, first-author papers only)
- Site-wide notice banner with date window and 24h dismissal
- "Compact view" toggle persisted in localStorage
- OpenGraph / Twitter card meta, canonical URL, JSON-LD schema
- GitHub Actions: Pages deploy, Scholar refresh, CodeQL
- Deep links survive hard refresh on GitHub Pages (build-time route entry points + `404.html` fallback)

## Backlog
P1
- Define the `pageMuted` / `pageBorder` theme tokens used by the publication page (currently undefined in Tailwind 4)
- Add GitHub / ORCID / Twitter links if the user wants them

P2
- Light/dark toggle
- "Talks & Service" section
- Tag-based publication search
