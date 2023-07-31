#!/usr/bin/env -S deno run -A
import {
  build as buildNodePackage,
  emptyDir,
} from 'https://deno.land/x/dnt@0.38.0/mod.ts';
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
    /**
     * Note
     * Any shims must be both Node & Web compatible
     */
    shims: {
      deno: { test: true },
    },
    compilerOptions: {
      lib: ['DOM', 'ES2021'],
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
    async postBuild() {
      // steps to run after building and before running the tests
      await Deno.copyFile('LICENSE', `${OUT_DIR}/LICENSE`);
      await Deno.copyFile('README.md', `${OUT_DIR}/README.md`);

      // Tar dist
      const cmd = new Deno.Command('tar', {
        args: ['-czf', `dist--v${version}.tar.gz`, `${OUT_DIR}/`],
      });
      await cmd.output();
    },
  });
}

build();
