#!/usr/bin/env -S deno run -A
import {
  build as buildNodePackage,
  emptyDir,
} from 'https://deno.land/x/dnt@0.32.0/mod.ts';
import pkgJson from '../package.json' assert { type: 'json' };

const { name, version, description, author, license, repository, bugs } =
  pkgJson;

export const SRC_DIR = './src';
export const OUT_DIR = './dist';
export const ENTRY_POINT = `${SRC_DIR}/index.ts`;

export async function build() {
  await emptyDir(OUT_DIR);
  await buildNodePackage({
    entryPoints: [ENTRY_POINT],
    outDir: OUT_DIR,
    shims: {
      deno: true,
      undici: true,
    },
    package: {
      name,
      version,
      description,
      author,
      license,
      repository,
      bugs,
    },
    postBuild() {
      // steps to run after building and before running the tests
      Deno.copyFileSync('LICENSE', `${OUT_DIR}/LICENSE`);
      Deno.copyFileSync('README.md', `${OUT_DIR}/README.md`);
    },
  });
}

build();
