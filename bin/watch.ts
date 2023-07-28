#!/usr/bin/env -S deno run -A
import { debounce } from 'https://deno.land/std@0.181.0/async/debounce.ts';
import { build, SRC_DIR } from './build.ts';

// Re-run when the directory changes
const debouncedBuild = debounce(build, 5000);
const watcher = Deno.watchFs(SRC_DIR);
for await (const _e of watcher) {
  debouncedBuild();
}
