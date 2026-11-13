# Tanzila Rahman — Academic Portfolio

A modern, static React portfolio for [Tanzila Rahman](https://scholar.google.com/citations?user=7GKKBLkAAAAJ&hl=en), Senior Research Scientist at Huawei Canada. Live at **https://trahman888.github.io**.

Built with React 19, TypeScript, Vite, Tailwind CSS v4, framer-motion and recharts. There is no backend: all content lives in data files under `src/data/`, and the site deploys to GitHub Pages via GitHub Actions.

## Project structure

```
src/
  App.tsx               # routes: /, /publications, /publications/:publicationId
  pages/                # Home, Publication, NotFound
  components/           # Navbar, NoticeBar, Hero, About, Impact, News, Publications, Awards, Footer, …
  contexts/             # "compact view" toggle
  data/                 # ← edit these to update content
    profile.ts          # name, photo, bio, links, affiliations, research interests
    publications.ts     # paper list + filter categories
    page-publications/  # optional per-paper explainer pages (JSON)
    authors.ts          # co-author → homepage links
    news.ts             # news timeline
    awards.ts           # awards & honours
    notice.ts           # optional site-wide banner
  lib/                  # types, helpers, rich-text parser, constants
public/
  data/scholar.json     # citation metrics (auto-generated, loaded at runtime)
  images/               # profile photo; images/pub/ for paper thumbnails
  tanzila_rahman_resume.pdf
scripts/
  scrape_scholar.py     # Google Scholar → public/data/scholar.json
.github/workflows/
  deploy.yml            # build & publish to GitHub Pages
  update-scholar.yml    # weekly cron to refresh Scholar metrics
  codeql.yml            # CodeQL security scanning
```

## Local development

Requires Node 22+.

```bash
npm install
cp .env.example .env     # then fill in values (optional)
npm run dev              # http://localhost:5173
npm run build            # type-check + production build into dist/
npm run lint
npm run preview          # serve the production build
```

### Environment variables

| Variable | Purpose |
|---|---|
| `VITE_GA_TRACKING_ID` | Google Analytics 4 measurement ID |
| `VITE_SHOW_PUBLICATION_PAGE` | Set to `true` to enable per-publication explainer pages |

In CI these are read from repository secrets of the same name.

## Updating content

Everything lives in `src/data/`:

| File | What to edit |
|---|---|
| `profile.ts` | Name, title, institution, bio, photo, social links, CV, affiliations (`current: true` marks the current one) |
| `publications.ts` | Add/remove papers (newest first), set categories, `venueShort`, and a thumbnail `image` (path relative to `public/`, e.g. `images/pub/Paper.png`) |
| `page-publications/*.json` | Explainer page content for a paper. Import it in `publications.ts` and set it as that paper's `pageContent` |
| `authors.ts` | Co-author homepages (alphabetical by first name). Matching names in author lists are linked automatically |
| `news.ts` | Add new entries at the top of the array |
| `awards.ts` | Awards and honours |
| `notice.ts` | Banner shown site-wide when `pinned` is `true` and the current date is between `startDate` and `endDate` |

To change the profile photo, put the file in `public/images/` and update `profile.photo`.

### Text formatting

Most text fields support a small markdown subset:

- `*bold*` (single asterisks)
- `[label](https://example.com)` for links
- `![alt text](images/foo.png)` for images

### Publication explainer pages

A paper gets a page at `/publications/<id>` when **all** of these are true:

1. `VITE_SHOW_PUBLICATION_PAGE=true`
2. the publication has `pageContent`
3. Tanzila Rahman is the first author

Each page is made of `sections`, each with `blocks` of type `text`, `list`, `hero-grid`, `gallery` or `comparison` (see `PublicationPageContent` in `src/lib/types.ts`).

## Refreshing Google Scholar metrics

The Impact section reads `public/data/scholar.json` when the page loads. There are two ways to refresh it.

### 1. Automatically (GitHub Actions)

`.github/workflows/update-scholar.yml` runs **every Sunday at 06:00 UTC** and can also be started manually. It:

1. Installs Python 3.11 and `requirements.txt`, which includes [`scholarly`](https://pypi.org/project/scholarly/).
2. Runs `scripts/scrape_scholar.py`.
3. Commits `public/data/scholar.json` only if the metrics changed. This triggers a redeploy.

> ⚠️ Google Scholar heavily rate-limits GitHub Actions IPs. When the script is blocked it exits successfully without writing anything, so the workflow stays green but the metrics don't update. Running it manually from your own machine is more reliable.

### 2. Manually

```bash
pip install -r requirements.txt
python scripts/scrape_scholar.py
git add public/data/scholar.json
git commit -m "chore(scholar): refresh metrics"
git push
```

If Scholar blocks your IP, edit `public/data/scholar.json` by hand. It's plain JSON.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds the site with Node 22 and publishes `dist/` when:

- you push to `main`,
- the "Update Scholar Data" workflow completes, or
- you start it manually.

**One-time repo setup:**

1. Go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
2. Add the `VITE_GA_TRACKING_ID` and `VITE_SHOW_PUBLICATION_PAGE` repository secrets.
3. (Optional) Add a custom domain.

The site uses root-absolute paths and client-side routing (`BrowserRouter`), so it expects to be served from the domain root (`https://<username>.github.io/`).

GitHub Pages can't rewrite URLs for single-page apps. To make links like `/publications/<id>` work on refresh, the build (a small plugin in `vite.config.ts`) copies `index.html` to `404.html` and to `publications/<id>/index.html` for every publication. New publications are picked up automatically. If you add a new top-level route, add it to the plugin's `routes` list.
