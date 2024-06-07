import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import WaitingRoom from '../Components/WaitingRoom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { games } from '../Games/games';

function Play({}) {

    const [waiting,setWaiting] = useState(false);
    const [gameMode,setGameMode] = useState("");

    const user = useSelector(store => store.auth.user);
    const loading = useSelector(store => store.auth.loading);

    const navigate = useNavigate();

    function leaveRoom()
    {
        setWaiting(false);
    }

    useEffect(()=>{
        if(!loading)
        {
            if(!user) navigate("/");
        }
    },[loading,user]);


    return (
        <div className='page-container font-mono text-white d-flex flex-column justify-content-center align-items-center'>
            {
                waiting ?
                <WaitingRoom gameMode={gameMode} leaveRoom={leaveRoom}/>
                :
                <Container className='d-flex flex-column align-items-center justify-content-center gap-2'>
                    <h1>Choose Game</h1>

                    <Row className='mt-3'>
                    {
                        games.map((game)=>
                        
                            <Col key={`game-col-${game.code}`}>
                                <div className='d-flex flex-column align-items-center dark-bg shadow p-3'>
                                    <h3>{game.title}</h3>
                                    <p className='comment'>{game.desc}</p>
                                    <Button
                                    className='main-button arrow w-100 mt-3 fs-5'
                                    onClick={()=>{
                                        setGameMode(game.code);
                                        setWaiting(true);
                                    }}
                                    >Play</Button>
                                </div>
                            </Col>
                        )
                    }
                    </Row>
                </Container>
            }
        </div>
    );
}

export default Play;