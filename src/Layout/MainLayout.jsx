import React from 'react';
import { Outlet } from 'react-router';
import NavBar from './NavBar';
import AudioManager from './AudioManager';

function MainLayout({}) {
    return (
        <>
            <NavBar />
            <Outlet />
            <AudioManager />
        </>
    );
}

export default MainLayout;