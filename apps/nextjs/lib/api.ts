import { createNextFetchApi } from "next-ts-api";
import { type ApiRoutes } from "../types/next-ts-api";
export const api = createNextFetchApi<ApiRoutes>();


// use case
const res1 = await api('test-api', {
    method: 'PUT',
    body: {
        id: '123',
    }
})

// res1 => {
//     id: string;
//     text: string;
//     completed: boolean;
// }

const res2 = await api('test-api', {
    method: 'DELETE',
    params: {
        id: '123',
    }
})

// res2 => {
//     success: boolean;
// }