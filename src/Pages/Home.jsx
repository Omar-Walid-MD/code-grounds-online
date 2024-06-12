import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import EntryForm from '../Components/EntryForm';
import { games } from '../Games/games';
import { auth } from '../Firebase/firebase';

function Home({}) {

    const navigate = useNavigate();

    const user = useSelector(store => store.auth.user);
    const loading = useSelector(store => store.auth.loading);

    console.log(user);
    
    return (
        <div className='page-container d-flex flex-column align-items-center justify-content-center'>
        {
            loading ?
            <Spinner className='text-white' />
            :
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