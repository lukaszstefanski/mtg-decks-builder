import { Box, IconButton } from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import CardPlaceholder from '../CardPlaceholder';
import {
    addFavouriteCard,
    removeFavouriteCard,
} from '../../redux/slices/favouriteCards';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { CardI } from '../../types';

interface PropsI {
    card: CardI;
}

const Card = ({ card }: PropsI) => {
    const { id, name, imageUrl } = card;

    const dispatch = useAppDispatch();
    const addCardToFavourite = () => dispatch(addFavouriteCard(card));
    const removeCardFromFavourite = () => dispatch(removeFavouriteCard(id));

    if (!imageUrl) {
        return <CardPlaceholder card={card} />;
    }
    // @TODO Move to new directory as separate component
    return (
        <Box>
            <img src={imageUrl} alt={name} />
            <IconButton
                w="45%"
                m="5px"
                onClick={addCardToFavourite}
                colorScheme="blue"
                aria-label="Add to favourite"
                icon={<AddIcon boxSize={4} />}
            />
            <IconButton
                w="45%"
                m="5px"
                onClick={removeCardFromFavourite}
                colorScheme="blue"
                aria-label="Remove from favourite"
                icon={<CloseIcon boxSize={4} />}
            />
        </Box>
    );
};

export default Card;
