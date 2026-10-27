import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC_LOGO = 'src/assets/brand/logo.png';
const PUBLIC_DIR = 'public';
const BRAND_DIR = path.join(PUBLIC_DIR, 'images', 'brand');

async function generate() {
  if (!fs.existsSync(SRC_LOGO)) {
    throw new Error(`Source logo not found at ${SRC_LOGO}`);
  }

  if (!fs.existsSync(BRAND_DIR)) {
    fs.mkdirSync(BRAND_DIR, { recursive: true });
  }

  console.log(`Processing source logo from ${SRC_LOGO}...`);

  // 1. Copy full-res logo to public/images/brand/logo.png and public/logo.png
  await sharp(SRC_LOGO).png({ compressionLevel: 9 }).toFile(path.join(BRAND_DIR, 'logo.png'));
  await sharp(SRC_LOGO).png({ compressionLevel: 9 }).toFile(path.join(PUBLIC_DIR, 'logo.png'));
  console.log('✓ Created public/images/brand/logo.png and public/logo.png (1024x1024)');

  // 2. Generate standard Google Favicons (multiples of 48px square)
  const sizes = [
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'favicon-144x144.png', size: 144 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'favicon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];

  for (const item of sizes) {
    const dest = path.join(PUBLIC_DIR, item.name);
    await sharp(SRC_LOGO)
      .resize(item.size, item.size, { fit: 'contain', background: { r: 5, g: 8, b: 7, alpha: 1 } })
      .png({ compressionLevel: 9 })
      .toFile(dest);
    console.log(`✓ Created ${dest} (${item.size}x${item.size})`);
  }

  // 3. Generate multi-resolution favicon.ico (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const icoBuffers = [];
  for (const s of icoSizes) {
    const buf = await sharp(SRC_LOGO)
      .resize(s, s, { fit: 'contain', background: { r: 5, g: 8, b: 7, alpha: 1 } })
      .png()
      .toBuffer();
    icoBuffers.push({ width: s, height: s, buffer: buf });
  }

  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // 1 = ICO
  icoHeader.writeUInt16LE(icoBuffers.length, 4);

  const dirEntries = [];
  let offset = 6 + (icoBuffers.length * 16);

  for (const img of icoBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width, 0);
    entry.writeUInt8(img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  const icoFinal = Buffer.concat([
    icoHeader,
    ...dirEntries,
    ...icoBuffers.map(b => b.buffer)
  ]);

  const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');
  fs.writeFileSync(icoPath, icoFinal);
  console.log(`✓ Created ${icoPath} (${icoFinal.length} bytes, multi-res 16/32/48)`);

  // 4. Update favicon.svg with embedded base64 PNG of the real logo
  const b64_512 = (await sharp(SRC_LOGO).resize(512, 512).png().toBuffer()).toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <image href="data:image/png;base64,${b64_512}" width="512" height="512"/>
</svg>\n`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), svgContent, 'utf-8');
  console.log('✓ Updated public/favicon.svg with real brand logo');
}

generate().catch(err => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
