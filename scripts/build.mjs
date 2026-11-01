import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

fs.mkdirSync(distDir, { recursive: true });

const pdfWorkerSrc = path.join(rootDir, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
if (fs.existsSync(pdfWorkerSrc)) {
  fs.copyFileSync(pdfWorkerSrc, path.join(distDir, 'pdf.worker.min.mjs'));
}

const commonConfig = {
  bundle: true,
  sourcemap: false,
  minify: false,
  target: ['chrome120', 'firefox121'],
  logLevel: 'info',
};

await Promise.all([
  esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(rootDir, 'src/background/index.ts')],
    outfile: path.join(distDir, 'background.js'),
    format: 'esm',
  }),
  esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(rootDir, 'src/content/index.ts')],
    outfile: path.join(distDir, 'content.js'),
    format: 'iife',
  }),
  esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(rootDir, 'src/popup/index.ts')],
    outfile: path.join(distDir, 'popup.js'),
    format: 'esm',
  }),
  esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(rootDir, 'src/dashboard/index.ts')],
    outfile: path.join(distDir, 'dashboard.js'),
    format: 'esm',
  }),
  esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(rootDir, 'src/books/index.ts')],
    outfile: path.join(distDir, 'books.js'),
    format: 'esm',
  }),
  esbuild.build({
    ...commonConfig,
    entryPoints: [path.join(rootDir, 'src/video/index.ts')],
    outfile: path.join(distDir, 'video.js'),
    format: 'esm',
  }),
]);

console.log('✓ Built all Verba bundles into dist/');
