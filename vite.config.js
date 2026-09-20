import { defineConfig } from 'vite';

function inlineSiteStyles() {
  return {
    name: 'inline-site-styles',
    enforce: 'post',
    apply: 'build',
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find((item) => item.type === 'asset' && item.fileName === 'index.html');
      const css = Object.values(bundle).find((item) => item.type === 'asset' && item.fileName.endsWith('.css'));
      if (!html || !css) return;

      const stylesheet = `<link rel="stylesheet" crossorigin href="./${css.fileName}">`;
      const cssSource = String(css.source).replaceAll('url(./', 'url(./assets/');
      html.source = String(html.source).replace(stylesheet, `<style>${cssSource}</style>`);
      delete bundle[css.fileName];
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [inlineSiteStyles()],
  build: {
    target: 'es2022',
    minify: 'esbuild',
    cssMinify: true,
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    port: 3000,
    open: false
  }
});
