import { useGetAllCardsQuery } from '../../redux/api/cards';

const Cards = () => {
    const { data, error, isLoading } = useGetAllCardsQuery();

    if (error) {
        return <div>Error during data fetch</div>;
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (data && data.cards.length > 0) {
        return (
            <>
                {data.cards.map(({ id, name, imageUrl }) => (
                    <div key={id}>
                        <img src={imageUrl} alt={name} />
                    </div>
                ))}
            </>
        );
    }
    return <div>No data</div>;
};

export default Cards;
