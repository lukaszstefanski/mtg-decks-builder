import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Checkbox, Stack } from '@chakra-ui/react';
import { Colors } from '../../types';

interface PropsI {
    register: UseFormRegister<FieldValues>;
}

const CardColorsCheckboxGroup = ({ register }: PropsI) => (
    <Stack
        direction="row"
        spacing="1"
        border="1px solid"
        borderColor="blue.600"
        borderRadius="5px"
        padding="0 15px"
    >
        <Checkbox
            value={Colors.Blue}
            borderColor="blue.600"
            {...register('colorIdentity')}
        >
            Blue
        </Checkbox>
        <Checkbox
            value={Colors.Red}
            borderColor="blue.600"
            {...register('colorIdentity')}
        >
            Red
        </Checkbox>
        <Checkbox
            value={Colors.Black}
            borderColor="blue.600"
            {...register('colorIdentity')}
        >
            Black
        </Checkbox>
        <Checkbox
            value={Colors.Green}
            borderColor="blue.600"
            {...register('colorIdentity')}
        >
            Green
        </Checkbox>
        <Checkbox
            value={Colors.White}
            borderColor="blue.600"
            {...register('colorIdentity')}
        >
            White
        </Checkbox>
    </Stack>
);

export default CardColorsCheckboxGroup;
