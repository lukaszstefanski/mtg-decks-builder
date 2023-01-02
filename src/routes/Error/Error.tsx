import { useRouteError } from 'react-router-dom';

type ErrorResponse = {
    status: number;
    statusText?: string;
    message?: string;
};

const Error = () => {
    const error = useRouteError() as ErrorResponse;

    return (
        <p>
            {error.status} - {error.statusText || error.message}
        </p>
    );
};

export default Error;
