/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { watch } from "chokidar";
import type { NextConfig } from "next";
import type { Configuration, WebpackPluginInstance } from "webpack";
import { NextTsApiOptions, writeNextTsApi } from "./lib/core.js";
import { getAppDirectory } from "./lib/utils.js";

type WebpackConfigContext = Parameters<NonNullable<NextConfig["webpack"]>>[1];

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

interface NextTsApiPluginOptions extends WithRoutesOptions {
  /**
   * If you are getting the `Could not find a Next.js pages directory` error,
   * try passing `cwd: __dirname` from your `next.config.js`.
   */
  cwd?: string;
}

class NextTsApiPlugin implements WebpackPluginInstance {
  name = "NextTsApiPlugin";
  constructor(
    private readonly config: NextConfig,
    private readonly context: WebpackConfigContext,
    private readonly options: NextTsApiPluginOptions = {},
  ) { }

  apply() {
    if (this.context.isServer) return;

    const options = {
      ...this.config,
      ...this.options,
    };

    const watchDirs = getAppDirectory();

    if (this.context.dev) {
      const watcher = watch(watchDirs, { persistent: true });
      const generate = debounce(() => writeNextTsApi(options), 50);
      watcher.on("add", generate).on("unlink", generate).on('change', generate)
    } else {
      writeNextTsApi(options);
    }
  }
}

type WithRoutesOptions = Pick<NextTsApiOptions, "outDir" | "dir" | 'outFile'>;

export const nextTsApi = (
  options?: WithRoutesOptions,
): ((nextConfig: NextConfig) => NextConfig) => {
  return function (nextConfig) {
    return {
      ...nextConfig,
      webpack: (config: Configuration, context) => {
        config.plugins ??= [];
        config.plugins.push(new NextTsApiPlugin(nextConfig, context, options));
        // invoke any existing webpack extensions
        if (nextConfig.webpack) {
          return nextConfig.webpack(config, context);
        }
        return config;
      },
    };
  };
}
