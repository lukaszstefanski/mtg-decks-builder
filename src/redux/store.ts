import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import favouriteCardsReducer from './slices/favouriteCards';
import { cardsApi } from './api/cards';
import { typesApi } from './api/types';

export const store = configureStore({
    reducer: {
        favouriteCards: favouriteCardsReducer,
        [cardsApi.reducerPath]: cardsApi.reducer,
        [typesApi.reducerPath]: typesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cardsApi.middleware, typesApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
