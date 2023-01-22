import { useState } from 'react';
import { Grid, GridItem, Flex, Button, Spinner } from '@chakra-ui/react';
import Card from '../Card';
import { useGetCardsQuery } from '../../redux/api/cards';
import { FiltersI } from '../../types';

interface PropsI {
    filters: FiltersI;
}

const CardsList = ({ filters }: PropsI) => {
    const [page, setPage] = useState<number>(1);
    const { data, error, isLoading } = useGetCardsQuery({
        page,
        ...filters,
    });

    if (error) {
        return <div>Error during data fetch</div>;
    }
    if (isLoading) {
        return (
            <Flex h="60vh" justify="center" align="center">
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                />
            </Flex>
        );
    }

    if (data) {
        return (
            <>
                <Grid templateColumns="repeat(5, 1fr)" gap={2}>
                    {data.cards.map((card) => (
                        <GridItem key={card.id}>
                            <Card card={card} />
                        </GridItem>
                    ))}
                </Grid>
                <Flex justify="center" m="40px 0">
                    <Button
                        w="120px"
                        m="5px 15px"
                        colorScheme="blue"
                        isDisabled={page === 1}
                        onClick={() => setPage((prevState) => prevState - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        w="120px"
                        m="5px 15px"
                        colorScheme="blue"
                        onClick={() => setPage((prevState) => prevState + 1)}
                    >
                        Next
                    </Button>
                </Flex>
            </>
        );
    }

    return <div>No data</div>;
};

export default CardsList;
