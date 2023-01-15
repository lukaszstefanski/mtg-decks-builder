import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import Menu from '../../components/Menu';

const Root = () => (
    <Flex direction="column" h="100vh" bgColor="white">
        <Flex as="nav" h="10vh" bgColor="blue.600">
            <Menu />
        </Flex>
        <Flex h="90vh" w="90vw" m="5vh auto" direction="row">
            <Outlet />
        </Flex>
    </Flex>
);

export default Root;
