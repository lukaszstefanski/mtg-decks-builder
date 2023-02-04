import { UseFormRegister, FieldValues } from 'react-hook-form';
import { Select } from '@chakra-ui/react';
import { useGetTypesQuery } from '../../redux/api/types';

interface PropsI {
    register: UseFormRegister<FieldValues>;
}

const CardTypesSelect = ({ register }: PropsI) => {
    const { data, isLoading } = useGetTypesQuery();

    if (isLoading || !data || !data.types) {
        return <Select placeholder="Card type" m="0 10px" isDisabled />;
    }

    return (
        <Select
            placeholder="Card type"
            m="0 10px"
            borderColor="blue.600"
            _hover={{ borderColor: 'blue.600' }}
            {...register('type')}
        >
            {data.types
                // .filter() was used because API return values which are invalid in card type context
                .filter((type) => type !== '--' && type !== 'instant')
                .map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
        </Select>
    );
};

export default CardTypesSelect;
