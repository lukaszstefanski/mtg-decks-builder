import { Outlet } from 'react-router-dom';

const Root = () => (
    <>
        <ul>
            <li>Menu item 1</li>
            <li>Menu item 2</li>
        </ul>
        <Outlet />
    </>
);

export default Root;
