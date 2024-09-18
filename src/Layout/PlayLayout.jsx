import React from 'react';
import { Outlet } from 'react-router';
import AudioManager from './AudioManager';

function Main({}) {
    return (
        <>
            <Outlet />
            <AudioManager />
        </>
    );
}

export default Main;