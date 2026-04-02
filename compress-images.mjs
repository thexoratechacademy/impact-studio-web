import sharp from "sharp";
import { readdir, stat, rename } from "fs/promises";
import { join, extname, basename } from "path";

const QUALITY = 80;
const MAX_WIDTH = 1200;
const MIN_SIZE_KB = 300;

const dirs = [
  "assets/images/Thexora-Images/Profs",
  "assets/images/Thexora-Images/web-development",
  "assets/images/Thexora-Images/mobile- app-development",
  "assets/images/Thexora-Images/data-analysis",
  "assets/images/Thexora-Images/Digital-Marketing",
  "assets/images/Thexora-Images/cybersecurity",
  "assets/images/Thexora-Images/product-design",
  "assets/images",
  "assets/images/roles",
  "assets/images/Features",
];

async function getFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile())
      .map((e) => join(dir, e.name));
  } catch {
    return [];
  }
}

async function compressImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return;
  // Skip CR3 raw files
  if (ext === ".cr3") return;

  const info = await stat(filePath);
  const sizeKB = info.size / 1024;
  if (sizeKB < MIN_SIZE_KB) return;

  const name = basename(filePath);
  const sizeMB = (info.size / 1024 / 1024).toFixed(2);

  try {
    // Create backup name
    const backupPath = filePath + ".backup";
    await rename(filePath, backupPath);

    const pipeline = sharp(backupPath).resize({
      width: MAX_WIDTH,
      height: MAX_WIDTH,
      fit: "inside",
      withoutEnlargement: true,
    });

    if (ext === ".png") {
      await pipeline.png({ quality: QUALITY, compressionLevel: 9 }).toFile(filePath);
    } else {
      await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(filePath);
    }

    const newInfo = await stat(filePath);
    const newSizeMB = (newInfo.size / 1024 / 1024).toFixed(2);
    console.log(`✓ ${name}: ${sizeMB} MB → ${newSizeMB} MB`);
  } catch (err) {
    console.error(`✗ ${name}: ${err.message}`);
    // Restore backup on failure
    try {
      const { access } = await import("fs/promises");
      try {
        await access(filePath);
      } catch {
        await rename(filePath + ".backup", filePath);
      }
    } catch {}
  }
}

console.log("Compressing images (max 1200px, quality 80)...\n");

for (const dir of dirs) {
  const files = await getFiles(dir);
  for (const file of files) {
    await compressImage(file);
  }
}

console.log("\nDone! Backup files saved as *.backup");
console.log("Run: Get-ChildItem -Recurse -Filter '*.backup' assets/images | Remove-Item");
console.log("to delete backups after verifying results.");
