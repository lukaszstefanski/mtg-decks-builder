import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Menu from '../../components/Menu';

const Root = () => (
    <Flex direction="column" bgColor="white">
        <Flex as="nav" h="65px" bgColor="blue.600">
            <Menu />
        </Flex>
        <Flex w="90vw" m="0 auto" direction="row" justify="center">
            <Outlet />
        </Flex>
    </Flex>
);

export default Root;
