import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Card } from '../../types/card';

interface Cards {
    cards: Card[] | [];
}

export const cardsApi = createApi({
    reducerPath: 'cardsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.magicthegathering.io/v1/',
    }),
    endpoints: (builder) => ({
        getAllCards: builder.query<Cards, void>({
            query: () => 'cards?pageSize=10&gameFormat=standard',
        }),
    }),
});

export const { useGetAllCardsQuery } = cardsApi;
