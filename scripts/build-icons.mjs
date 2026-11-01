import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const outDir = path.resolve('icons');
fs.mkdirSync(outDir, { recursive: true });

// Original Verba geometric book-prism mark (slate-navy background, sky-cyan & emerald chevron pages)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <rect fill="#0f172a" width="16" height="16" rx="3.5"/>
  <path fill="#38bdf8" d="M3.2 3.5 L7.4 5.2 L7.4 12.6 L3.2 10.9 Z"/>
  <path fill="#10b981" d="M12.8 3.5 L8.6 5.2 L8.6 12.6 L12.8 10.9 Z"/>
  <circle fill="#f59e0b" cx="8" cy="3.1" r="1.2"/>
</svg>
`;
fs.writeFileSync(path.join(outDir, 'verba-mark.svg'), svgContent, 'utf8');

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function insideRoundedRect(x, y, rx, ry, rw, rh, rad) {
  if (x < rx || x > rx + rw || y < ry || y > ry + rh) return false;
  const cx = Math.max(rx + rad, Math.min(x, rx + rw - rad));
  const cy = Math.max(ry + rad, Math.min(y, ry + rh - rad));
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= rad * rad;
}

function sampleVerbaIcon(nx, ny) {
  if (!insideRoundedRect(nx, ny, 0, 0, 16, 16, 3.5)) {
    return [0, 0, 0, 0];
  }
  // Amber spark dot at top center
  const dxDot = nx - 8.0;
  const dyDot = ny - 3.1;
  if (dxDot * dxDot + dyDot * dyDot <= 1.25 * 1.25) {
    return [245, 158, 11, 255]; // #f59e0b
  }
  // Left book wing (#38bdf8)
  if (nx >= 3.2 && nx <= 7.4) {
    const t = (nx - 3.2) / 4.2;
    const topY = 3.5 + t * 1.7;
    const botY = 10.9 + t * 1.7;
    if (ny >= topY && ny <= botY) {
      return [56, 189, 248, 255];
    }
  }
  // Right book wing (#10b981)
  if (nx >= 8.6 && nx <= 12.8) {
    const t = (12.8 - nx) / 4.2;
    const topY = 3.5 + t * 1.7;
    const botY = 10.9 + t * 1.7;
    if (ny >= topY && ny <= botY) {
      return [16, 185, 129, 255];
    }
  }
  return [15, 23, 42, 255]; // #0f172a slate-navy background
}

function renderPng(size) {
  const raw = Buffer.alloc(size * (1 + size * 4));
  const sub = 4;
  for (let py = 0; py < size; py++) {
    const rowStart = py * (1 + size * 4);
    raw[rowStart] = 0;
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < sub; sy++) {
        for (let sx = 0; sx < sub; sx++) {
          const nx = ((px + (sx + 0.5) / sub) / size) * 16;
          const ny = ((py + (sy + 0.5) / sub) / size) * 16;
          const [sr, sg, sb, sa] = sampleVerbaIcon(nx, ny);
          r += sr * (sa / 255);
          g += sg * (sa / 255);
          b += sb * (sa / 255);
          a += sa;
        }
      }
      const samples = sub * sub;
      const finalA = Math.round(a / samples);
      const finalR = finalA > 0 ? Math.round((r / samples) / (finalA / 255)) : 0;
      const finalG = finalA > 0 ? Math.round((g / samples) / (finalA / 255)) : 0;
      const finalB = finalA > 0 ? Math.round((b / samples) / (finalA / 255)) : 0;
      const idx = rowStart + 1 + px * 4;
      raw[idx] = Math.min(255, finalR);
      raw[idx + 1] = Math.min(255, finalG);
      raw[idx + 2] = Math.min(255, finalB);
      raw[idx + 3] = Math.min(255, finalA);
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const size of [16, 32, 48, 128]) {
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), renderPng(size));
}
console.log('Generated Verba icons (16, 32, 48, 128 + SVG).');
