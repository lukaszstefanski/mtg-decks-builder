import { useForm, SubmitHandler } from 'react-hook-form';
import {
    Box,
    Flex,
    Input,
    Stack,
    Checkbox,
    Select,
    Button,
} from '@chakra-ui/react';
import { useGetTypesQuery } from '../../redux/api/types';
import { FiltersI } from '../../types';

interface PropsI {
    submitForm: (userFilters: FiltersI) => void;
}

const Filters = ({ submitForm }: PropsI) => {
    // @TODO Handle error during fetching types
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FiltersI>();

    const { data, isLoading } = useGetTypesQuery();

    const submit: SubmitHandler<FiltersI> = (userFilters) => {
        submitForm(userFilters);
    };

    return (
        <Box
            p="20px 0"
            m="50px 0"
            border="1px solid"
            borderColor="blue.600"
            borderRadius="10px"
        >
            <form onSubmit={handleSubmit(submit)}>
                <Flex direction="row">
                    <Input
                        placeholder="Name"
                        {...register('name')}
                        m="0 10px"
                    />
                    {isLoading ? (
                        <Select placeholder="Card type" isDisabled m="0 10px" />
                    ) : (
                        <Select
                            placeholder="Card type"
                            {...register('type')}
                            m="0 10px"
                        >
                            {data &&
                                data.types
                                    .filter((type) => type !== '--')
                                    .map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                        </Select>
                    )}
                    <Stack direction="row" spacing="1">
                        <Checkbox value="U" {...register('colorIdentity')}>
                            Blue
                        </Checkbox>
                        <Checkbox value="R" {...register('colorIdentity')}>
                            Red
                        </Checkbox>
                        <Checkbox value="B" {...register('colorIdentity')}>
                            Black
                        </Checkbox>
                        <Checkbox value="G" {...register('colorIdentity')}>
                            Green
                        </Checkbox>
                        <Checkbox value="W" {...register('colorIdentity')}>
                            White
                        </Checkbox>
                    </Stack>
                    <Button colorScheme="blue" type="submit" w="20%" m="0 10px">
                        Search
                    </Button>
                </Flex>
            </form>
        </Box>
    );
};

export default Filters;
