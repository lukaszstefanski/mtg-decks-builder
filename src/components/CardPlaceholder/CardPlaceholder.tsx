import { Stack, Text, Divider } from '@chakra-ui/react';
import { CardI } from '../../types';

interface PropsI {
    card: CardI;
}

const CardPlaceholder = ({ card }: PropsI) => {
    const {
        name,
        manaCost,
        type,
        text,
        rarity,
        power,
        toughness,
        // @TODO Add background color based on colorIdentity
        colorIdentity,
    } = card;
    // @TODO Add buttons to add to favourite and remove from favourite actions
    return (
        <Stack
            h="310px"
            w="224px"
            p="10px"
            spacing={3}
            border="9px solid"
            borderColor="black"
            borderRadius="9px"
        >
            <Text fontSize="xs">
                {name} - {manaCost}
            </Text>
            <Divider />
            <Text fontSize="xs">
                {type} - {rarity}
            </Text>
            <Divider />
            <Text fontSize="xs">{text}</Text>
            <Divider />
            {power && toughness && (
                <Text fontSize="xs">
                    {power}/{toughness}
                </Text>
            )}
        </Stack>
    );
};

export default CardPlaceholder;
