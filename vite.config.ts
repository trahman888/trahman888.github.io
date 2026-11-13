import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

/**
 * GitHub Pages has no SPA rewrites, so a hard refresh on a client-side route
 * (e.g. /publications/tribert) would hit GitHub's 404 page. After the build:
 *  - copy index.html to <route>/index.html for every known route, so those
 *    URLs are served with a real 200 status (good for SEO);
 *  - copy index.html to 404.html, so any other URL still boots the app and
 *    React Router renders the NotFound page.
 */
function githubPagesSpaFallback(): Plugin {
  let root = process.cwd()
  let outDir = 'dist'

  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    configResolved(config) {
      root = config.root
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const indexHtml = join(outDir, 'index.html')

      // Publication ids are read from the data file (top-level `id: "..."` entries).
      const source = readFileSync(join(root, 'src/data/publications.ts'), 'utf-8')
      const ids = [...source.matchAll(/^\s{4}id:\s*"([^"]+)"/gm)].map((m) => m[1])
      if (ids.length === 0) {
        throw new Error('[github-pages-spa-fallback] no publication ids found in src/data/publications.ts')
      }

      const routes = ['publications', ...ids.map((id) => `publications/${id}`)]
      for (const route of routes) {
        const dir = join(outDir, route)
        mkdirSync(dir, { recursive: true })
        copyFileSync(indexHtml, join(dir, 'index.html'))
      }
      copyFileSync(indexHtml, join(outDir, '404.html'))

      console.log(`[github-pages-spa-fallback] wrote 404.html + ${routes.length} route entry points`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), githubPagesSpaFallback()],
})
