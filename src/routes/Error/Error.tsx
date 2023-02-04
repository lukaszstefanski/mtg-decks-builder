import { useRouteError } from 'react-router-dom';

interface ErrorResponseI {
    status: number;
    statusText?: string;
    message?: string;
}

const Error = () => {
    const error = useRouteError() as ErrorResponseI;

    return (
        <p>
            {error.status} - {error.statusText || error.message}
        </p>
    );
};

export default Error;
