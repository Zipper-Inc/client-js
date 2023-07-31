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
const OUT_PACKAGE_JSON_PATH = `${OUT_DIR}/package.json`;

/**
 * Enforces known `package.json` order
 * Fixes the `Module not found: Default condition should be last one` error
 * @param path Path to output package.json
 */
async function enforcePkgJsonOrder(path: string) {
  const { default: outPkgJson } = await import(`../${path}`, {
    assert: { type: 'json' },
  });

  const pkgImport = outPkgJson.exports['.'].import;
  const pkgRequire = outPkgJson.exports['.'].require;

  outPkgJson.exports['.'].import = {
    types: pkgImport.types,
    default: pkgImport.default,
  };

  outPkgJson.exports['.'].require = {
    types: pkgRequire.types,
    default: pkgRequire.default,
  };

  return Deno.writeTextFile(path, JSON.stringify(outPkgJson, undefined, 2));
}

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
    async postBuild() {
      // steps to run after building and before running the tests
      await Deno.copyFile('LICENSE', `${OUT_DIR}/LICENSE`);
      await Deno.copyFile('README.md', `${OUT_DIR}/README.md`);
      await enforcePkgJsonOrder(OUT_PACKAGE_JSON_PATH);
    },
  });
}

build();
