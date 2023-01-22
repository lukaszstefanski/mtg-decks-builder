import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Box } from '@chakra-ui/react';
import Filters from '../../components/Filters';
import CardsList from '../../components/CardsList';
import { FiltersI } from '../../types';

const Cards = () => {
    const [filters, setFilters] = useState<FiltersI>({});

    const submitForm: SubmitHandler<FiltersI> = ({
        name,
        colorIdentity,
        type,
    }) => {
        // @TODO Create validation schema mapper
        let mappedFilters = {};
        if (name !== '') {
            mappedFilters = { ...mappedFilters, name };
        }
        if (colorIdentity && colorIdentity.length > 0) {
            mappedFilters = { ...mappedFilters, colorIdentity };
        }
        if (type !== '' && type !== '--') {
            mappedFilters = { ...mappedFilters, type };
        }
        setFilters(mappedFilters);
    };

    return (
        <Box w="60vw">
            <Filters submitForm={submitForm} />
            <CardsList filters={filters} />
        </Box>
    );
};

export default Cards;
