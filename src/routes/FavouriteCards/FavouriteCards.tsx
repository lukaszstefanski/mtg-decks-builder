import { RootState } from '../../redux/store';
import { addFavouriteCard } from '../../redux/slices/favouriteCards';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';

const FavouriteCards = () => {
    const newCard = {
        id: 'test-3',
        name: 'Grassball',
    };
    const favouriteCards = useAppSelector(
        (state: RootState) => state.favouriteCards
    );
    const dispatch = useAppDispatch();

    return (
        <>
            <button
                type="button"
                onClick={() => dispatch(addFavouriteCard(newCard))}
            >
                Add new card
            </button>
            <ul>
                {favouriteCards.map(({ id, name }) => (
                    <li key={id}>{name}</li>
                ))}
            </ul>
        </>
    );
};

export default FavouriteCards;
