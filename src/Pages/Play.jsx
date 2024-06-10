import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { games } from '../Games/games';
import Classic from "../GameComponents/Classic";
function Play({}) {

    const gameMode = useLocation().state?.gameMode;
    const navigate = useNavigate();

    useEffect(()=>{
        if(!gameMode) navigate("/");
    },[]);

    return (
        <>
        {
            gameMode==="classic" && <Classic />
        }
        </>
    );
}

export default Play;