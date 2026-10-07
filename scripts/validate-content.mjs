// Validates src/content/answers.json against the Answer type in src/lib/types.ts
// and keeps it in sync with the images in public/memes/, including their pixel sizes.
// Runs as `prebuild`, so any problem fails `npm run build`.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const file = join(root, "src/content/answers.json");
const memesDir = join(root, "public/memes");
const imagePattern = /\.(png|jpe?g)$/i;
const errors = [];

// Reads width and height from a PNG or JPEG header.
function readImageSize(buffer) {
  if (buffer.readUInt32BE(0) === 0x89504e47) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff || buffer[offset + 1] === 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      // SOF markers carry the frame size. C4, C8 and CC are other segments.
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }
  return null;
}

function sizeOf(name) {
  return readImageSize(readFileSync(join(memesDir, name)));
}

let entries;
try {
  entries = JSON.parse(readFileSync(file, "utf8"));
} catch (error) {
  console.error(`answers.json is not valid JSON: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(entries) || entries.length === 0) {
  errors.push("answers.json must be a non-empty array");
  entries = [];
}

const ids = new Set();
const listed = new Set();
const isText = (value) => typeof value === "string" && value.trim() !== "";

entries.forEach((entry, index) => {
  const at = `entry ${index}${entry && entry.id ? ` (${entry.id})` : ""}`;
  if (typeof entry !== "object" || entry === null) {
    errors.push(`${at}: must be an object`);
    return;
  }
  if (!isText(entry.id)) errors.push(`${at}: missing "id"`);
  else if (ids.has(entry.id)) errors.push(`${at}: duplicate id`);
  else ids.add(entry.id);

  if (!isText(entry.alt)) errors.push(`${at}: missing "alt" text`);
  if (entry.tags !== undefined && !(Array.isArray(entry.tags) && entry.tags.every(isText))) {
    errors.push(`${at}: "tags" must be an array of strings`);
  }

  if (!isText(entry.imageUrl) || !entry.imageUrl.startsWith("/memes/")) {
    errors.push(`${at}: "imageUrl" must start with /memes/`);
  } else if (!imagePattern.test(entry.imageUrl)) {
    errors.push(`${at}: memes must be JPG or PNG`);
  } else if (!existsSync(join(root, "public", entry.imageUrl))) {
    errors.push(`${at}: image not found at public${entry.imageUrl}`);
  } else {
    const name = entry.imageUrl.slice("/memes/".length);
    listed.add(name);
    const size = sizeOf(name);
    if (!size) errors.push(`${at}: could not read the image size`);
    else if (entry.width !== size.width || entry.height !== size.height) {
      errors.push(`${at}: "width" and "height" must be ${size.width} and ${size.height}`);
    }
  }
});

const files = existsSync(memesDir) ? readdirSync(memesDir).filter((name) => !name.startsWith(".")) : [];
for (const name of files) {
  if (!imagePattern.test(name)) {
    errors.push(`public/memes/${name}: memes must be JPG or PNG`);
  } else if (!listed.has(name)) {
    const size = sizeOf(name) ?? { width: 0, height: 0 };
    errors.push(
      `public/memes/${name} is not in answers.json. Add:\n  { "id": "...", "imageUrl": "/memes/${name}", "width": ${size.width}, "height": ${size.height}, "alt": "describe the meme and its text" }`,
    );
  }
}

if (errors.length > 0) {
  console.error(`answers.json has ${errors.length} problem(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`answers.json OK (${entries.length} memes)`);
