import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Input } from '@chakra-ui/react';

interface PropsI {
    register: UseFormRegister<FieldValues>;
}

const CardNameInput = ({ register }: PropsI) => (
    <Input
        placeholder="Card name"
        m="0 10px"
        borderColor="blue.600"
        _hover={{ borderColor: 'blue.600' }}
        {...register('name')}
    />
);

export default CardNameInput;
