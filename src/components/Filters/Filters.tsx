import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Flex, Button } from '@chakra-ui/react';
import CardNameInput from '../CardNameInput';
import CardTypesSelect from '../CardTypesSelect';
import CardColorsCheckboxGroup from '../CardColorsCheckboxGroup';
import { FiltersI } from '../../types';

interface PropsI {
    setFilters: (userFilters: FiltersI) => void;
}

const Filters = ({ setFilters }: PropsI) => {
    // @TODO Handle error during fetching types
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FiltersI>();

    const submitForm: SubmitHandler<FiltersI> = ({
        name,
        colorIdentity,
        type,
    }) => {
        const mappedFilters = {} as FiltersI;
        if (name) mappedFilters.name = name;
        if (colorIdentity && colorIdentity.length > 0)
            mappedFilters.colorIdentity = colorIdentity;
        if (type) mappedFilters.type = type;
        setFilters(mappedFilters);
    };

    return (
        <Box
            p="20px 0"
            m="50px 0"
            border="1px solid"
            borderColor="blue.600"
            borderRadius="10px"
        >
            <form onSubmit={handleSubmit(submitForm)}>
                <Flex direction="row">
                    <CardNameInput register={register} />
                    <CardTypesSelect register={register} />
                    <CardColorsCheckboxGroup register={register} />
                    <Button type="submit" w="20%" m="0 10px" colorScheme="blue">
                        Search
                    </Button>
                </Flex>
            </form>
        </Box>
    );
};

export default Filters;
