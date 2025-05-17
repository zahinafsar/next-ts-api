import fs, { existsSync, mkdirSync } from 'fs';
import path, { join } from 'path';
import { logger } from './logger';
import { getAppDirectory } from './utils';

interface RouteInfo {
    path: string;
    methods: {
        [key: string]: {
            importPath: string;
            exportName: string;
        };
    };
}

export interface NextTsApiOptions {
    /**
     * Location of the Next.js project. Defaults to the current working directory.
     *
     * This is only necessary when working with a non standard NextJS project setup, such as Nx.
     *
     * Example:
     *
     * // next.config.js
     * const { nextTsApi } = require('next-ts-api/config')
     * const withNextTsApi = nextTsApi({ dir: __dirname });
     */
    dir?: string | undefined;
    /**
     * The file path indicating the output directory where the generated route types
     */
    outDir?: string | undefined;
    /**
     * The file name of the output file.
     */
    outFile?: string | undefined;
}

function getRelativePath(from: string, to: string): string {
    const relativePath = path.relative(path.dirname(from), to)
        .replace(/\\/g, '/') // Convert Windows paths to Unix
        .replace(/\.ts$/, '');
    return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

export function findRouteFiles(dir: string, routes: RouteInfo[] = [], basePath: string[] = []): RouteInfo[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Skip special directories
            if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
            findRouteFiles(fullPath, routes, [...basePath, entry.name]);
        } else if (entry.name === 'route.ts') {
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            const methods: { [key: string]: { importPath: string; exportName: string } } = {};
            
            // Regex to find exported HTTP method handlers (both function and const)
            const exportRegex = /export\s+(?:(?:async\s+)?function|const)\s+(GET|POST|PUT|DELETE|PATCH)/g;
            let match;

            while ((match = exportRegex.exec(fileContent)) !== null) {
                const method = match[1];
                methods[method] = {
                    importPath: fullPath,
                    exportName: method,
                };
            }

            if (Object.keys(methods).length > 0) {
                routes.push({
                    path: basePath.join('/'),
                    methods,
                });
            }
        }
    }

    return routes;
}

export function generateTypeDefinitions(routes: RouteInfo[], options: Required<NextTsApiOptions>): string {
    let imports = 'import type { ExtractNextBody, ExtractNextQuery, ExtractNextResponse, ExtractNextParams } from \'next-ts-api\';\n';
    let importCounter = 1;
    const importMap = new Map<string, { counter: number; methods: Set<string> }>();

    // Collect imports
    routes.forEach(route => {
        Object.entries(route.methods).forEach(([method, info]) => {
            const importPath = getRelativePath(join(options.outDir, options.outFile), info.importPath);
            if (!importMap.has(importPath)) {
                importMap.set(importPath, { counter: importCounter++, methods: new Set([method]) });
            } else {
                importMap.get(importPath)!.methods.add(method);
            }
        });
    });

    // Generate import statements
    importMap.forEach((value, importPath) => {
        const methods = Array.from(value.methods)
            .map(method => `${method} as ${method}_${value.counter}`)
            .join(', ');
        imports += `import type { ${methods} } from '${importPath}';\n`;
    });

    // Generate type definition
    let typeDefinition = '\nexport type ApiRoutes = {\n';

    routes.forEach(route => {
        const routePath = route.path || 'root';
        typeDefinition += `  '${routePath}': {\n`;

        Object.entries(route.methods).forEach(([method, info]) => {
            const importPath = getRelativePath(join(options.outDir, options.outFile), info.importPath);
            const counter = importMap.get(importPath)!.counter;

            typeDefinition += `    ${method}: {\n`;
            if (!['GET', 'DELETE'].includes(method)) {
                typeDefinition += `      body: ExtractNextBody<typeof ${method}_${counter}>\n`;
            }
            typeDefinition += `      response: ExtractNextResponse<typeof ${method}_${counter}>\n`;
            typeDefinition += `      query: ExtractNextQuery<typeof ${method}_${counter}>\n`;
            typeDefinition += `      params: ExtractNextParams<typeof ${method}_${counter}>\n`;
            typeDefinition += `    },\n`;
        });

        typeDefinition += `  };\n`;
    });

    typeDefinition += '};\n';

    return imports + typeDefinition;
}

export function writeNextTsApi(options?: NextTsApiOptions): void {
    const PROJECT_ROOT = process.cwd();
    const API_DIR = path.join(getAppDirectory(), 'api');
    const TYPES_DIR = path.join(PROJECT_ROOT, 'types');

    const defaultOptions = {
        dir: options?.dir ?? API_DIR,
        outDir: options?.outDir ?? TYPES_DIR,
        outFile: options?.outFile ?? "next-ts-api.ts",
    };

    const opts = {
        ...defaultOptions,
        ...options,
    };

    if (opts.outDir && !existsSync(opts.outDir)) {
        mkdirSync(opts.outDir, { recursive: true });
    }

    try {
        const routes = findRouteFiles(API_DIR);                                                                                                      
        const typeDefinitions = generateTypeDefinitions(routes, opts);
        const outputFilepath = join(opts.outDir, opts.outFile);
        fs.writeFileSync(outputFilepath, typeDefinitions);
    } catch (error) {
        logger.error('Error generating API type definitions:', error);
    }
}