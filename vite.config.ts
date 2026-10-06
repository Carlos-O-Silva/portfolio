import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { projects } from './src/data/projects.ts'

/**
 * Metadados que dependem do endereço público do site.
 *
 * Título, descrição e tipo (Open Graph e Twitter) ficam fixos no index.html e funcionam
 * em qualquer lugar. Já a URL canônica, og:url, a imagem de compartilhamento (que precisa
 * de endereço absoluto) e o sitemap só existem com o domínio definido no build:
 *
 *   SITE_URL=https://seu-dominio.com npm run build
 *
 * (ou SITE_URL=... num arquivo .env). Sem ele, o build gera só o robots.txt e avisa.
 */
function siteMeta(siteUrl: string | undefined): Plugin {
  const base = siteUrl?.replace(/\/+$/, '')
  if (base && !/^https?:\/\/[^/]+/.test(base)) throw new Error(`SITE_URL inválida: "${siteUrl}". Use algo como https://seu-dominio.com`)

  return {
    name: 'site-meta',
    transformIndexHtml() {
      if (!base) return [{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' }, injectTo: 'head' }]
      const image = `${base}/og.png`
      return [
        { tag: 'link', attrs: { rel: 'canonical', href: `${base}/` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:url', content: `${base}/` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: image }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'Carlos Alberto, desenvolvedor full stack: Ideias que viram sistemas.' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: image }, injectTo: 'head' },
      ]
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', ...(base ? ['', `Sitemap: ${base}/sitemap.xml`] : [])]
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots.join('\n') + '\n' })
      if (!base) {
        this.warn('SITE_URL não definida: o build sai sem URL canônica, og:url, imagem de compartilhamento e sitemap.')
        return
      }
      const urls = ['/', ...projects.map((project) => `/projetos/${project.slug}`)]
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((path) => `  <url><loc>${base}${path}</loc></url>`),
        '</urlset>',
      ]
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap.join('\n') + '\n' })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), siteMeta(env.SITE_URL || undefined)],
  }
})
