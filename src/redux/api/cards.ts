import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CardI, FiltersI } from '../../types';

interface ResponseI {
    cards: CardI[] | [];
}

export const cardsApi = createApi({
    reducerPath: 'cardsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.magicthegathering.io/v1/',
    }),
    endpoints: (builder) => ({
        getCards: builder.query<ResponseI, FiltersI>({
            query: (params) => {
                return {
                    url: `cards?gameFormat=standard&pageSize=20`,
                    method: 'GET',
                    params,
                };
            },
        }),
    }),
});

export const { useGetCardsQuery } = cardsApi;
