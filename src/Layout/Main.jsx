import React from 'react';
import { Outlet } from 'react-router';
import NavBar from './NavBar';

function Main({}) {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
}

export default Main;