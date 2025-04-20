import { watch } from "chokidar";
import type { NextConfig } from "next";
import { NextTsApiOptions, writeNextTsApi } from "./lib/core.js";
import { getAppDirectory } from "./lib/utils.js";

function debounce<Fn extends (...args: unknown[]) => unknown>(
  fn: Fn,
  ms: number,
): (...args: Parameters<Fn>) => void {
  let id: NodeJS.Timeout;
  return function (...args) {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}

type WithRoutesOptions = Pick<NextTsApiOptions, "outDir" | "dir" | 'outFile'>;

export const nextTsApi = (
  options?: WithRoutesOptions,
): ((nextConfig: NextConfig) => NextConfig) => {
  return function (nextConfig) {
    const watchDirs = getAppDirectory();
    const watcher = watch(watchDirs, { persistent: true });
    const generate = debounce(() => writeNextTsApi(options), 50);
    watcher.on("add", generate).on("unlink", generate).on('change', generate)
    return nextConfig;
  };
}
