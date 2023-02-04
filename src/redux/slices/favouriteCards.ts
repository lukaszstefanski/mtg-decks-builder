import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardI } from '../../types';

export const initialState: CardI[] = [];

export const favouriteCardsSlice = createSlice({
    name: 'favouriteCards',
    initialState,
    reducers: {
        addFavouriteCard: (state, { payload }: PayloadAction<CardI>) => {
            state.push(payload);
        },
        removeFavouriteCard: (state, { payload }: PayloadAction<string>) =>
            state.filter(({ id }) => id !== payload),
    },
});

export const { addFavouriteCard, removeFavouriteCard } =
    favouriteCardsSlice.actions;
export default favouriteCardsSlice.reducer;
