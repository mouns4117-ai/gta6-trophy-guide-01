// Leonida Ledger — the GTA VI trophy guide entry for make.fun's
// gta6-trophy-guide-01 bounty (Node 22, standard library only).
//
// The guide itself is plain static files in app/: app/index.html opens in a
// browser and works with the network off, its trophy list and guides are
// app/data/trophies.json, and screenshots/ holds renders of the app taken by
// its maker. This program hands the entry in: it copies app/ and
// screenshots/ from beside this file into the output directory and writes
// /output/dossier.json, the summary the judge reads (the screenshots, the
// first load's files and bytes, and the source), built with the vendored
// make.fun library. Leave vendor/makefun-frontend.ts exactly as the kit
// shipped it: the scorer rebuilds the dossier with its own copy and the two
// must match byte for byte.
//
// Serve the guide locally with `node serve.ts`, then open
// http://localhost:8080. Outside the grader's container, MAKEFUN_OUTPUT_DIR
// stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(sourceDir, targetDir) {
  mkdirSync(targetDir, { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true });
}

function handInGuide() {
  mkdirSync(outputDir, { recursive: true });
  copyTree(join(repoRoot, 'app'), join(outputDir, 'app'));
  if (existsSync(join(repoRoot, 'screenshots'))) {
    copyTree(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'));
  } else {
    mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
  }

  // The scorer's own caps (the kit's reference/gate.json): only
  // text_max_bytes shapes the bytes; the others refuse an entry the scorer
  // would refuse (more than 4 screenshots or one over 256 KiB; more than
  // 993 files and directories in app/ or 48 MiB of app files: app/ counts
  // beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
  const dossier = buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  });
  writeFileSync(join(outputDir, 'dossier.json'), dossier);
}

handInGuide();
