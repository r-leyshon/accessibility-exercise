#!/usr/bin/env node

/**
 * Optimize A11ymon images for web.
 * - Resizes to 192x192 (2x retina for 96px display)
 * - Center-crops non-square images
 * - Compresses PNG
 *
 * Usage: node scripts/optimize-a11ymon-images.mjs
 */

import { readdir, stat, rename } from "fs/promises";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = resolve(__dirname, "../public/a11ymon");
const SIZE = 192;

async function optimizeImage(filename) {
  const inputPath = join(imagesDir, filename);
  const tempPath = join(imagesDir, `.${filename}.tmp`);
  const inputStats = await stat(inputPath);
  const inputSize = inputStats.size;

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  let pipeline = image;

  if (width !== height) {
    const cropSize = Math.min(width, height);
    pipeline = pipeline.extract({
      left: Math.floor((width - cropSize) / 2),
      top: Math.floor((height - cropSize) / 2),
      width: cropSize,
      height: cropSize,
    });
  }

  pipeline = pipeline
    .resize(SIZE, SIZE)
    .png({ compressionLevel: 9 });

  await pipeline.toFile(tempPath);
  await rename(tempPath, inputPath);

  const outputStats = await stat(inputPath);
  const outputSize = outputStats.size;
  const saved = ((1 - outputSize / inputSize) * 100).toFixed(1);

  return { filename, inputSize, outputSize, saved };
}

async function main() {
  const files = await readdir(imagesDir);
  const pngFiles = files
    .filter((f) => f.endsWith(".png") && /^\d{2}\.png$/.test(f))
    .sort();

  if (pngFiles.length === 0) {
    console.log("No A11ymon images (01.png–25.png) found in public/a11ymon/");
    process.exit(0);
  }

  console.log(`Optimizing ${pngFiles.length} images → ${SIZE}×${SIZE}px\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of pngFiles) {
    const result = await optimizeImage(file);
    totalBefore += result.inputSize;
    totalAfter += result.outputSize;
    const kbBefore = (result.inputSize / 1024).toFixed(1);
    const kbAfter = (result.outputSize / 1024).toFixed(1);
    console.log(
      `  ${file}: ${kbBefore}KB → ${kbAfter}KB (${result.saved}% smaller)`
    );
  }

  const totalSaved = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB (${totalSaved}% smaller)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
