import { NavLink } from 'react-router-dom';
import { Center, Flex, Text } from '@chakra-ui/react';

import { Routes } from '../../constants/routes';

interface MenuItemI {
    route: string;
    label: string;
}

const MenuItem = ({ route, label }: MenuItemI) => (
    <Center>
        <NavLink to={route}>
            {({ isActive }) => (
                <Text
                    fontSize="l"
                    color="white"
                    m="0 15px"
                    letterSpacing="1px"
                    textDecoration={isActive ? 'underline' : 'none'}
                >
                    {label}
                </Text>
            )}
        </NavLink>
    </Center>
);

const Menu = () => {
    return (
        <Flex w="100vw" justifyContent="center">
            <MenuItem route={Routes.Home} label="Home" />
            <MenuItem route={Routes.Cards} label="Cards" />
            <MenuItem route={Routes.FavouriteCards} label="Favourite cards" />
            <MenuItem route={Routes.Decks} label="Decks" />
        </Flex>
    );
};

export default Menu;
