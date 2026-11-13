// news-image-01 entry program (Node 22, standard library only).
//
// The entry is the image file entry.png next to this script: a newspaper
// front page summing up 13 November 2026's world news. This program copies
// those exact bytes to the output directory, so the judge sees the same
// image, byte for byte.
//
// Local check:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader the output directory is /output.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_NAME = 'entry.png';
const MAX_BYTES = 1024 * 1024; // the gate takes at most 1 MiB
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const digest = (data: Buffer): string =>
  createHash('sha256').update(data).digest('hex');

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, SOURCE_NAME);
const bytes = readFileSync(sourcePath);

if (bytes.length === 0) {
  throw new Error(`${SOURCE_NAME} is empty; nothing to submit`);
}
if (bytes.length > MAX_BYTES) {
  throw new Error(`${SOURCE_NAME} is ${bytes.length} bytes, over the 1 MiB gate`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const outPath = join(OUTPUT_DIR, SOURCE_NAME);
writeFileSync(outPath, bytes);

// Read the file back and prove the judge gets the exact same bytes.
const written = readFileSync(outPath);
if (digest(written) !== digest(bytes)) {
  throw new Error(`verification failed: ${outPath} does not match ${SOURCE_NAME}`);
}
console.log(`wrote ${outPath} (${bytes.length} bytes, sha256 ${digest(bytes)})`);
