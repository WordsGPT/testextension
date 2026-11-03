import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync, strToU8 } from 'fflate';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outZip = path.join(rootDir, 'dist', 'verba-firefox.zip');

const filesToPack = {};

function addFile(relPath) {
  const abs = path.join(rootDir, relPath);
  if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) return;
  filesToPack[relPath.replace(/\\/g, '/')] = new Uint8Array(fs.readFileSync(abs));
}

function addDir(relDir, filterFn) {
  const absDir = path.join(rootDir, relDir);
  if (!fs.existsSync(absDir)) return;
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    const childRel = path.posix.join(relDir, entry.name);
    if (entry.isDirectory()) {
      addDir(childRel, filterFn);
    } else if (!filterFn || filterFn(childRel)) {
      addFile(childRel);
    }
  }
}

// Build a clean Firefox-specific manifest.json (using background.scripts without service_worker)
const rawManifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'manifest.json'), 'utf8'));
const ffManifest = {
  ...rawManifest,
  browser_specific_settings: {
    ...rawManifest.browser_specific_settings,
    gecko: {
      id: 'verba-reader@verba.org',
      strict_min_version: '142.0',
      ...rawManifest.browser_specific_settings?.gecko,
      data_collection_permissions: rawManifest.browser_specific_settings?.gecko?.data_collection_permissions || {
        required: ['none'],
      },
    },
  },
  background: {
    scripts: ['dist/background.js'],
    type: 'module',
  },
};
filesToPack['manifest.json'] = strToU8(JSON.stringify(ffManifest, null, 2));

addFile('popup.html');
addFile('dashboard.html');
addFile('books.html');
addFile('video.html');
addDir('icons');
addDir('dictionaries');
addDir('samples');
addDir('src', (p) => p.endsWith('.css'));
addDir('dist', (p) => !p.endsWith('.zip') && !p.endsWith('.xpi'));

const zipped = zipSync(filesToPack, { level: 6 });
fs.mkdirSync(path.dirname(outZip), { recursive: true });
fs.writeFileSync(outZip, zipped);
console.log(`✓ Packaged Firefox MV3 archive (${Object.keys(filesToPack).length} files) -> dist/verba-firefox.zip`);

// Also generate a clean source archive (dist/verba-source.zip) for Mozilla AMO Reviewer submission
const outSourceZip = path.join(rootDir, 'dist', 'verba-source.zip');
const sourceFiles = {};

function addSourceFile(relPath) {
  const abs = path.join(rootDir, relPath);
  if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) return;
  sourceFiles[relPath.replace(/\\/g, '/')] = new Uint8Array(fs.readFileSync(abs));
}

function addSourceDir(relDir) {
  const absDir = path.join(rootDir, relDir);
  if (!fs.existsSync(absDir)) return;
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    const childRel = path.posix.join(relDir, entry.name);
    if (entry.isDirectory()) {
      addSourceDir(childRel);
    } else {
      addSourceFile(childRel);
    }
  }
}

addSourceFile('package.json');
addSourceFile('package-lock.json');
addSourceFile('tsconfig.json');
addSourceFile('manifest.json');
addSourceFile('README.md');
addSourceFile('popup.html');
addSourceFile('dashboard.html');
addSourceFile('books.html');
addSourceFile('video.html');
addSourceDir('scripts');
addSourceDir('src');
addSourceDir('tests');

const zippedSource = zipSync(sourceFiles, { level: 6 });
fs.writeFileSync(outSourceZip, zippedSource);
console.log(`✓ Packaged AMO Reviewer source archive (${Object.keys(sourceFiles).length} files) -> dist/verba-source.zip`);
