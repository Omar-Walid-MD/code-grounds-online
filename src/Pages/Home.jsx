import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { socket } from '../socketClient/socketClient';
import EntryForm from '../Components/EntryForm';
import { games } from '../Games/games';

function Home({}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(store => store.auth.user);

    // function userEnter(e)
    // {
    //     e.preventDefault();
    //     if(username!=="")
    //     {
    //         const user = {
    //             userId: uuidv4(),
    //             username: username.trim(),
    //             avatar: generateAvatar()
    //         };

    //         dispatch(setUser(user));

    //         socket.emit("login",user);

    //         navigate("/play");
    //     }
    // }

    // useEffect(()=>{
    //     if(user) navigate("play");
    // },[user])

    return (
        <div className='page-container d-flex flex-column align-items-center justify-content-center'>
        {
            user ?
            <Container className='font-mono text-white d-flex flex-column align-items-center justify-content-center gap-2'>
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
                                    // setGameMode(game.code);
                                    // setWaiting(true);
                                    navigate("/wait",{state:{gameMode:game.code}})
                                }}
                                >Play</Button>
                            </div>
                        </Col>
                    )
                }
                </Row>
            </Container>
            : <EntryForm />
        }
        </div>
    );
}

export default Home;