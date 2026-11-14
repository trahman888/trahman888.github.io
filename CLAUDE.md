# CLAUDE.md

Academic portfolio site for Tanzila Rahman (deployed to GitHub Pages at https://trahman888.github.io). Static React SPA with no backend: all content lives in TypeScript/JSON data files.

## Stack

- React 19 + TypeScript (~6.0) + Vite 8
- Tailwind CSS v4 via `@tailwindcss/vite` (configured in CSS in `src/index.css`; there is **no** `tailwind.config`)
- react-router-dom v7 (`BrowserRouter`), react-helmet-async (SEO/meta), framer-motion (animations), recharts (citation chart), lucide-react (icons), react-ga4 (analytics)
- Python 3.11 + `scholarly` for the Google Scholar scraper

## Commands

```bash
npm install
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build -> dist/  (type errors fail the build)
npm run lint      # eslint .
npm run preview   # serve dist/

pip install -r requirements.txt
python scripts/scrape_scholar.py   # refresh public/data/scholar.json
```

There is no test suite. Check your work with `npm run build` (strict: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, so use `import type` for type-only imports) and `npm run lint`.

## Environment variables (`.env`, see `.env.example`)

- `VITE_GA_TRACKING_ID`: GA4 ID. Falls back to `G-XXXXXXXXXX`.
- `VITE_SHOW_PUBLICATION_PAGE`: must be the string `"true"` to enable per-publication detail pages (`isAllowPublicationPage()` in `src/lib/utils.ts`).

In CI these come from repo secrets (see `deploy.yml`).

## Architecture

```
src/
  main.tsx              StrictMode > HelmetProvider > ThemeProvider > CompressProvider > App
  App.tsx               Routes: /  ·  /publications  ·  /publications/:publicationId  ·  * (NotFound); GA init
  pages/
    Home.tsx            Helmet SEO + JSON-LD; Hero, About, Impact, News, Publications, Awards, Footer
    Publication.tsx     No id: full Publications list. With id: tabbed explainer page from pageContent
    NotFound.tsx
  components/           One component per section (Navbar, Hero, About, Impact, News, Publications, Awards,
                        Footer, NoticeBar, Section, PublicationThumb, PublicationLinks, ui/RichText)
  contexts/             CompressContext ("compact view" toggle; adds `compressed` class to <html>,
                        persisted in localStorage key `siteCompressed`)
                        ThemeContext (light/dark; adds `dark` class to <html>, key `siteTheme`)
  data/                 ← ALL CONTENT LIVES HERE (re-exported via data/index.ts)
  lib/
    types.ts            All shared types and the PublicationCategory enum
    utils.ts            Author formatting, publication lookups, feature-flag helper
    richTextUtils.tsx   Mini-markdown parser/serializer helpers
    constants.ts        LS keys, INITIAL_VISIBLE_NEWS, GOOGLE_SCHOLAR_AUTHOR_ID
public/
  data/scholar.json     Citation metrics, fetched at runtime by Impact.tsx (auto-generated)
  images/, images/pub/  Profile photo and publication thumbnails
  tanzila_rahman_resume.pdf, favicon.svg, google*.html (Search Console verification)
```

## Content editing (most common task)

| File | Purpose |
|---|---|
| `src/data/profile.ts` | Name, title, bio paragraphs, photo, affiliations (`current: true` marks the current employer), research interests, links. Also feeds the JSON-LD schema in `data/schema.ts`. |
| `src/data/publications.ts` | `publications: Publication[]` (newest first) and `publicationCategories` (filter chips). `image` paths are relative to `public/` (e.g. `images/pub/Foo.png`). |
| `src/data/page-publications/*.json` | Optional explainer page content (`PublicationPageContent`), imported in `publications.ts` and attached as `pageContent`. |
| `src/data/authors.ts` | Co-author name → homepage URL map, alphabetical by first name. Names in author strings are auto-linked (an empty string means no link). |
| `src/data/news.ts` | `NewsItem[]`, newest first. The first `INITIAL_VISIBLE_NEWS` (3) are shown before "show more". |
| `src/data/awards.ts` | `Award[]` (`declined` flag supported). |
| `src/data/notice.ts` | Site-wide banner. Shown only when `pinned` and the current time is within `startDate`–`endDate`. Dismissal lasts 24h per `id`. |
| `public/data/scholar.json` | **Auto-generated** by the scraper. Don't hand-edit unless the scraper is broken. |

### Rich text convention

Strings rendered through `<RichText>` support a tiny markdown subset (`src/lib/richTextUtils.tsx`):
- `*bold*` (**single** asterisks, not `**`)
- `[label](url)` links (external URLs open in a new tab)
- `![alt](url)` images

The pipeline is `renderRichText()`: passes run in order **images → links → bold** (`RENDER_PASSES`), each over the plain-string parts left by the previous one. Output is re-keyed by position. The same regexes back the `make…Text()` generators and the `clear…()` strippers (`clearRich()` = all). All splitting goes through one `tokenize()` helper, which uses `matchAll`, so the shared `/g` regexes hold no state. To add markup, write a `tokenize`-based pass and insert it into `RENDER_PASSES` at the right precedence.

Author strings go through `formatAuthors()`, which links co-authors from `authors.ts` and bolds `profile.name`.

### Publication detail pages

A publication gets a detail page at `/publications/:id` only when **all** of these hold (`getPublicationContent` in `lib/utils.ts`):
1. `VITE_SHOW_PUBLICATION_PAGE === "true"`
2. it has `pageContent`
3. `profile.name` is the **first** author (otherwise it logs a warning and returns null)

`pageContent.sections[].blocks[]` are discriminated by `type`: `text`, `list`, `hero-grid`, `gallery`, `comparison`. They are rendered by `components/Section.tsx`. Sections display as tabs (only the active one is visible), not as scroll anchors. To add a block type, update the union in `lib/types.ts` and add a `switch` case in `Section.tsx`.

`components/PublicationPager.tsx` renders Previous/Next cards at the bottom of a detail page. It uses `getAdjacentPublicationPages(id)` in `lib/utils.ts`, which walks only publications where `hasPublicationPage()` is true, in `publications.ts` order (newest first). In `pages/Publication.tsx` the detail view (`PublicationDetail`) is keyed by publication id, so client-side navigation between papers resets the active tab. Keep that key if you restructure the page.

Scrolling on publication pages is handled by `hooks/useScrollMemory.ts`. New navigation (PUSH/REPLACE) starts at the top. Back, Forward and reload (POP) restore the position saved for that history entry (`location.key`, kept in sessionStorage). While the hook is mounted it sets `history.scrollRestoration = "manual"`. It uses layout effects with `behavior: "instant"`, because the global `scroll-behavior: smooth` in `App.css` would otherwise animate the jump. The home page doesn't use the hook: its Navbar scrolls to `#hash` or to `#top`.

Home page SEO keywords use `getFirstAuthorPublications()`.

## Theming (light / dark)

- `ThemeToggle` (navbar on desktop and mobile, and the NotFound header) flips the theme via `useTheme()`. The visitor's choice is saved in localStorage. Until they choose, the OS `prefers-color-scheme` is followed.
- An inline script in `index.html` sets `html.dark` before first paint to prevent a flash. It hardcodes the `siteTheme` key, so keep it in sync with `LS_SITE_THEME_KEY` and `theme-provider.tsx`.
- **Dark mode is a palette remap, not `dark:` classes everywhere.** In `src/index.css`, `html.dark` redefines `--color-white` and `--color-slate-50…950` to an inverted dark scale. Light mode uses Tailwind's defaults unchanged. So:
  - **Build UI with `white` + `slate-*` utilities** and it themes automatically (`bg-white` = page/card surface, `text-slate-900` = strongest text, `bg-slate-900 text-white` = primary button, which inverts correctly).
  - Other color families, arbitrary values (`bg-[#…]`) and inline hex styles don't remap. Add a `dark:` variant (class-based `@custom-variant dark`) or pick colors from `useTheme()`, as `Impact.tsx` does for the recharts palette (`CHART_COLORS`).
  - Surfaces that are dark in **both** themes (Footer, PublicationThumb placeholder, NotFound tile, NoticeBar) carry `theme-fixed`, which restores the default palette for that subtree so `text-white` stays white. Use it for any new always-dark block.

## Google Scholar pipeline

- `scripts/scrape_scholar.py` fetches author `AUTHOREID` with `scholarly` (direct request first, then a free-proxy fallback) and writes `public/data/scholar.json` (`Scholar` type: `profileUrl`, `lastUpdate`, `totals`, `perYear`).
- On failure (captcha, 429) it exits 0 **without** modifying the file, so the old values are kept.
- `Impact.tsx` loads it at runtime via `fetchScholar()` (`fetch("/data/scholar.json")`), so it isn't bundled. Keep the JSON shape in sync with the `Scholar`/`CitationTotals` types.

## CI / Deployment (`.github/workflows/`)

- `deploy.yml`: on push to `main`, manual dispatch, or completion of "Update Scholar Data". Runs Node 22 `npm ci && npm run build` and deploys `dist/` to GitHub Pages.
- `update-scholar.yml`: weekly (Sun 06:00 UTC) plus manual dispatch. Runs the scraper and commits `scholar.json` if it changed.
- `codeql.yml`: CodeQL scanning.

## Gotchas

- `README.md` (user-facing setup/content guide) and `PRD.md` (product history + backlog) should be kept in sync when adding sections, data files, env vars or workflows.
- **SPA deep links on GitHub Pages:** the `githubPagesSpaFallback` plugin in `vite.config.ts` copies `dist/index.html` to `dist/404.html` and to `dist/publications[/<id>]/index.html` after each build, so hard refreshes work (known routes return 200). It reads publication ids from `src/data/publications.ts` by regex (4-space-indented `id: "..."` lines) and fails the build if it finds none. **If you add a new top-level route in `App.tsx`, add it to that plugin's `routes` list.** Assets must use root-absolute paths (`/images/...`) to load correctly from nested routes.
- `Section.tsx` / `Publication.tsx` use the classes `text-pageMuted` and `border-pageBorder`, which aren't defined anywhere (no `@theme` tokens), so they have no effect.
- `.env` is gitignored. Only `.env.example` is committed.
