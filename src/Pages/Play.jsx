import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { games } from '../Games/games';
import Classic from "./Games/Classic";
import Fastest from "./Games/Fastest";

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
            "" 
        }
        </>
    );
}

export default Play;