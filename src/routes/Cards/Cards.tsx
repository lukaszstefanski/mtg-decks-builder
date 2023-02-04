import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import Filters from '../../components/Filters';
import CardsList from '../../components/CardsList';
import { FiltersI } from '../../types';

const Cards = () => {
    const [filters, setFilters] = useState<FiltersI>({});

    return (
        <Box w="60vw">
            <Filters setFilters={setFilters} />
            <CardsList filters={filters} />
        </Box>
    );
};

export default Cards;
