import { createNextFetchApi } from "next-ts-api";
import { type ApiRoutes } from "../types/next-ts-api";
export const api = createNextFetchApi<ApiRoutes>();