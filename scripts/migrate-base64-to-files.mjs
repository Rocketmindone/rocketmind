#!/usr/bin/env node
/**
 * Migration: extract base64-embedded assets from markdown frontmatter
 * and save them as separate files in public/images/products/.
 *
 * Usage:
 *   node scripts/migrate-base64-to-files.mjs          # dry run
 *   node scripts/migrate-base64-to-files.mjs --apply   # actually write
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_DIR = path.resolve("apps/site");
const PUBLIC_DIR = path.join(SITE_DIR, "public");
const CONTENT_DIRS = {
  consulting: path.join(SITE_DIR, "content", "products"),
  academy: path.join(SITE_DIR, "content", "academy"),
  "ai-products": path.join(SITE_DIR, "content", "ai-products"),
  cases: path.join(SITE_DIR, "content", "cases"),
  media: path.join(SITE_DIR, "content", "media"),
};

const MIME_TO_EXT = {
  "image/png": ".png", "image/jpeg": ".jpg", "image/jpg": ".jpg",
  "image/webp": ".webp", "image/svg+xml": ".svg", "image/gif": ".gif",
  "audio/mpeg": ".mp3", "audio/mp3": ".mp3", "audio/wav": ".wav",
  "audio/ogg": ".ogg", "audio/mp4": ".m4a", "audio/x-m4a": ".m4a",
  "audio/webm": ".webm",
};

const dryRun = !process.argv.includes("--apply");

if (dryRun) {
  console.log("🔍 DRY RUN — no files will be modified. Pass --apply to write.\n");
} else {
  console.log("✏️  APPLY MODE — files will be written.\n");
}

let totalExtracted = 0;
let totalCleaned = 0;

function parseDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;
  const ext = MIME_TO_EXT[match[1]];
  if (!ext) return null;
  return { ext, buffer: Buffer.from(match[2], "base64") };
}

function extractAndSave(category, slug, role, dataUrl) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) {
    console.log(`  ⚠️  ${role}: failed to parse data URL`);
    return false;
  }

  const dir = path.join(PUBLIC_DIR, "images", "products", category, slug);
  const filePath = path.join(dir, `${role}${parsed.ext}`);
  const sizeKB = (parsed.buffer.length / 1024).toFixed(1);

  console.log(`  📁 ${role}${parsed.ext} (${sizeKB} KB) → ${path.relative(".", filePath)}`);

  if (!dryRun) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, parsed.buffer);
  }

  totalExtracted++;
  return true;
}

for (const [sectionId, dir] of Object.entries(CONTENT_DIRS)) {
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    if (!data.slug) continue;

    const category = data.category || sectionId;
    const slug = data.slug;

    let modified = false;
    const fields = [];

    // Hero image
    if (data.hero?.heroImageData && data.hero.heroImageData.startsWith("data:")) {
      console.log(`\n📄 ${sectionId}/${slug} — hero image`);
      if (extractAndSave(category, slug, "cover", data.hero.heroImageData)) {
        delete data.hero.heroImageData;
        modified = true;
        fields.push("heroImageData");
      }
    }

    // Hero audio
    if (data.hero?.audioData && data.hero.audioData.startsWith("data:")) {
      console.log(`\n📄 ${sectionId}/${slug} — audio`);
      if (extractAndSave(category, slug, "audio", data.hero.audioData)) {
        delete data.hero.audioData;
        delete data.hero.audioFilename;
        modified = true;
        fields.push("audioData");
      }
    }

    // About image
    if (data.about?.aboutImageData && data.about.aboutImageData.startsWith("data:")) {
      console.log(`\n📄 ${sectionId}/${slug} — about image`);
      if (extractAndSave(category, slug, "about", data.about.aboutImageData)) {
        delete data.about.aboutImageData;
        modified = true;
        fields.push("aboutImageData");
      }
    }

    if (modified) {
      const sizeBefore = Buffer.byteLength(raw, "utf-8");
      const newContent = matter.stringify("", data);
      const sizeAfter = Buffer.byteLength(newContent, "utf-8");
      const savedKB = ((sizeBefore - sizeAfter) / 1024).toFixed(1);

      console.log(`  🧹 Cleaned ${fields.join(", ")} from frontmatter (saved ${savedKB} KB)`);

      if (!dryRun) {
        fs.writeFileSync(filePath, newContent, "utf-8");
      }
      totalCleaned++;
    }
  }
}

console.log(`\n${"═".repeat(60)}`);
console.log(`Done. Extracted ${totalExtracted} assets, cleaned ${totalCleaned} markdown files.`);
if (dryRun) console.log("This was a dry run. Run with --apply to write files.");
