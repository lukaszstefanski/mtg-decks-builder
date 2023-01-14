import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FavouriteCard = {
    id: string;
    name: string;
};

export const initialState: FavouriteCard[] = [
    {
        id: 'test-1',
        name: 'Fireball',
    },
    {
        id: 'test-2',
        name: 'Waterball',
    },
];

export const favouriteCardsSlice = createSlice({
    name: 'favouriteCards',
    initialState,
    reducers: {
        addFavouriteCard: (
            state,
            { payload }: PayloadAction<FavouriteCard>
        ) => {
            state.push(payload);
        },
        removeFavouriteCard: (state, { payload }: PayloadAction<string>) => {
            state.filter(({ id }) => id !== payload);
        },
    },
});

export const { addFavouriteCard } = favouriteCardsSlice.actions;
export default favouriteCardsSlice.reducer;
