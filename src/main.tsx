import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import Root from './routes/Root';
import Home from './routes/Home';
import Cards from './routes/Cards';
import Card from './routes/Card';
import FavouriteCards from './routes/FavouriteCards';
import Decks from './routes/Decks';
import Error from './routes/Error';
import { Routes } from './constants/routes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <Error />,
        children: [
            { path: Routes.Home, element: <Home /> },
            { path: Routes.Cards, element: <Cards /> },
            { path: Routes.FavouriteCards, element: <FavouriteCards /> },
            { path: Routes.Decks, element: <Decks /> },
        ],
    },
    {
        path: Routes.Card,
        element: <Card />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider>
            <RouterProvider router={router} />
        </ChakraProvider>
    </React.StrictMode>
);
