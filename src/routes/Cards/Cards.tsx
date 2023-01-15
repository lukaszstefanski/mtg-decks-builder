import { useState } from 'react';
import { useGetAllCardsQuery } from '../../redux/api/cards';

const Cards = () => {
    const [page, setPage] = useState<number>(1);
    const { data, error, isLoading } = useGetAllCardsQuery(page);

    if (error) {
        return <div>Error during data fetch</div>;
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (data && data.cards.length > 0) {
        return (
            <>
                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((prevState) => prevState - 1)}
                >
                    Previous
                </button>
                {data.cards.map(({ id, name, imageUrl }) => (
                    <div key={id}>
                        <img src={imageUrl} alt={name} />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => setPage((prevState) => prevState + 1)}
                >
                    Next
                </button>
            </>
        );
    }
    return <div>No data</div>;
};

export default Cards;
