import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { logger } from "./logger";

function findDir(cwd: string, dir: string) {
  const paths = [join(cwd, dir), join(cwd, "src", dir)];
  for (const path of paths) {
    if (existsSync(path)) {
      return path;
    }
  }
  return undefined;
}

export function getAppDirectory() {
  let appDir = findDir(process.cwd(), "app");

  if (!appDir) {
    logger.error(`Could not find a Next.js app directory`);
    appDir = join(process.cwd(), "app");
  }

  return appDir;
}

export function findFiles(entry: string): string[] {
  return readdirSync(entry).flatMap((file) => {
    const filepath = join(entry, file);
    if (filepath.includes("node_modules")) {
      return [];
    }
    if (statSync(filepath).isDirectory()) {
      return findFiles(filepath);
    }
    return filepath;
  });
}

export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
