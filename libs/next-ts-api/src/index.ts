import { NextRequest, NextResponse } from "next/server";

/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams) */
interface URLSearchParamsType<T = unknown> {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/size) */
    readonly size: number;
    /**
     * Appends a specified key/value pair as a new search parameter.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/append)
     */
    append(name: keyof T, value: string): void;
    /**
     * Deletes the given search parameter, and its associated value, from the list of all search parameters.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/delete)
     */
    delete(name: keyof T, value?: string): void;
    /**
     * Returns the first value associated to the given search parameter.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/get)
     */
    get(name: keyof T): string | null;
    /**
     * Returns all the values association with a given search parameter.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/getAll)
     */
    getAll(name: keyof T): string[];
    /**
     * Returns a Boolean indicating if such a search parameter exists.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/has)
     */
    has(name: keyof T, value?: string): boolean;
    /**
     * Sets the value associated to a given search parameter to the given value. If there were several values, delete the others.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/set)
     */
    set(name: keyof T, value: string): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/sort) */
    sort(): void;
    /** Returns a string containing a query string suitable for use in a URL. Does not include the question mark. */
    toString(): string;
    /**
     * Executes a provided function once for each key/value pair in the URLSearchParams object.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/URLSearchParams/forEach)
     */
    forEach(callbackfn: (value: string, key: keyof T, parent: URLSearchParamsType<T>) => void, thisArg?: any): void;
}


/**
 * Extends NextRequest to add typed request body and URL search params
 * @template T - The type of the request body
 * @template P - The type of URL search params, defaults to Record<string,string>
 */
export type NextApiRequest<T, P = Record<string, string>> = Omit<NextRequest, 'nextUrl' | 'json'> & {
    json: () => Promise<T>;
    nextUrl: {
        searchParams: URLSearchParamsType<P>;
    }
}

/**
 * Extracts the request body type from a Next.js API route handler
 * @template T - The API route handler function type
 */
export type ExtractNextBody<T> =
    T extends (req: NextApiRequest<infer B, any>, ...args: any) => any
    ? B
    : never;

/**
 * Extracts the URL search params type from a Next.js API route handler
 * @template T - The API route handler function type
 */
export type ExtractNextParams<T> =
    T extends (req: NextApiRequest<any, infer P>, ...args: any) => any ? P : never;

/**
 * Extracts the response type from a Next.js API route handler, excluding error responses
 * @template T - The API route handler function type that returns a NextResponse
 */
export type ExtractNextResponse<T extends (...args: any) => any> =
    Awaited<ReturnType<T>> extends NextResponse<infer R> | infer _ // handle union
    ? R extends { error: any }
    ? never
    : R
    : never;


type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Creates a typed fetch API for API routes
 * @template AT - The API routes type
 * @returns A function that can be used to fetch data from API routes
 */
export const createNextFetchApi = <AT>({
    baseUrl = '/api'
} = {}) => {
    type PathsWithMethod<M extends HttpMethod> = {
        [K in keyof AT]: M extends keyof AT[K] ? K : never
    }[keyof AT];

    type ApiOptions<M extends HttpMethod, P extends PathsWithMethod<M>> = {
        method: M;
        params?: M extends keyof AT[P]
        ? 'params' extends keyof AT[P][M]
        ? AT[P][M]['params']
        : never
        : never;
        body?: M extends Exclude<HttpMethod, 'GET'>
        ? (M extends keyof AT[P]
            ? 'body' extends keyof AT[P][M]
            ? AT[P][M]['body']
            : never
            : never)
        : never;
    } & Omit<RequestInit, 'method' | 'body'>;

    type ApiResponse<M extends HttpMethod, P extends PathsWithMethod<M>> = M extends keyof AT[P]
        ? 'response' extends keyof AT[P][M]
        ? AT[P][M]['response']
        : never
        : never;

    type TypedResponse<T> = Omit<Response, 'json'> & {
        json: () => Promise<T>;
    };

    const fetchApi = async <M extends HttpMethod, P extends PathsWithMethod<M>>(
        path: P,
        options: ApiOptions<M, P>
    ): Promise<TypedResponse<ApiResponse<M, P>>> => {
        const { params, ...fetchOptions } = options;
        const queryParams = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';

        const response = await fetch(`${baseUrl}/${path as string}${queryParams}`, {
            ...fetchOptions,
            method: options.method,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        return response;
    }

    return fetchApi;
}