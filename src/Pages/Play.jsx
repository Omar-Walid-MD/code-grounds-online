import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { games } from '../Games/games';
import Classic from "./Games/Classic";
import Fastest from "./Games/Fastest";
import Bingo from './Games/Bingo';

function Play({}) {

    const gameMode = useLocation().state?.gameMode;
    const navigate = useNavigate();

    useEffect(()=>{
        if(!gameMode) navigate("/");
    },[]);

    return (
        <>
        {
            gameMode==="classic" ?
            <Classic />
            :
            gameMode === "fastest" ?
            <Fastest />
            :
            gameMode === "bingo" ?
            <Bingo />
            :
            "" 
        }
        </>
    );
}

export default Play;