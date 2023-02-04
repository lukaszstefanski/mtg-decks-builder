import { RootState } from '../../redux/store';
import { useAppSelector } from '../../hooks/useAppSelector';

const FavouriteCards = () => {
    const favouriteCards = useAppSelector(
        (state: RootState) => state.favouriteCards
    );

    // @TODO Use generic cards list instead of ul > li
    return (
        <ul>
            {favouriteCards.map(({ id, name, imageUrl }) => (
                <li key={id}>
                    <img src={imageUrl} alt={name} />
                </li>
            ))}
        </ul>
    );
};

export default FavouriteCards;
