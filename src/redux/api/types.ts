import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ResponseI {
    types: string[];
}

export const typesApi = createApi({
    reducerPath: 'typesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.magicthegathering.io/v1/',
    }),
    endpoints: (builder) => ({
        getTypes: builder.query<ResponseI, void>({
            query: () => ({ url: 'types' }),
        }),
    }),
});

export const { useGetTypesQuery } = typesApi;
