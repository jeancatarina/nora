import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building NORA for production...');

const distDir = path.join(__dirname, 'dist');

// Limpa e recria dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copia arquivos raiz essenciais
const rootFiles = ['index.html', 'favicon.svg', 'og-image.svg', 'robots.txt', 'sitemap.xml'];
for (const file of rootFiles) {
  const srcPath = path.join(__dirname, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, file));
    console.log(`✓ Copiado: ${file}`);
  }
}

// Copia pasta src/ completa (JS, CSS, Three.js)
const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, path.join(distDir, 'src'), { recursive: true });
  console.log('✓ Copiado: src/ (estilos, Three.js e scripts)');
}

// Copia pasta public/ completa se existir
const pubDir = path.join(__dirname, 'public');
if (fs.existsSync(pubDir)) {
  fs.cpSync(pubDir, path.join(distDir, 'public'), { recursive: true });
  console.log('✓ Copiado: public/');
}

console.log('Build finalizado com sucesso em dist/!');
