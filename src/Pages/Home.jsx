import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import EntryForm from '../Components/EntryForm';
import { games } from '../Games/games';
import { auth } from '../Firebase/firebase';
import { setUser } from '../Store/Auth/authSlice';
import { registerUser } from '../Firebase/DataHandlers/users';
import { generateAvatar, generateAvatarString } from '../Helpers/avatar';
import { socket } from '../socketClient/socketClient';

function Home({}) {

    const navigate = useNavigate();

    const user = useSelector(store => store.auth.user);
    const loading = useSelector(store => store.auth.loading);

    const [username,setUsername] = useState("");
    const [stage,setStage] = useState(0);

    const dispatch = useDispatch();

    function handleUsername(e)
    {
        if(e.target.value.length <= 20)
        {
            setUsername(e.target.value);
        }
    }

    function userEnter(e)
    {
        e.preventDefault();

        const avatarString = generateAvatarString();

        registerUser(user.userId,{
            username: username,
            avatar: avatarString
        });

        const updatedUser = {
            userId: user.userId,
            email: user.email,
            username: username,
            avatar: generateAvatar(avatarString)
        }
        dispatch(setUser(updatedUser));
    }

    useEffect(()=>{
        if(user?.username)
        {
            socket.emit("login",user);
        }
    },[]);

    
    return (
        <div className='page-container d-flex flex-column align-items-center justify-content-center'>
        {
            loading ?
            <Spinner className='text-white' />
            :
            user ?
            user.username ?
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
            :
            <>
                <form className="entry-form-container font-mono d-flex flex-column align-items-center gap-3 text-white" onSubmit={userEnter}>
                <input className='main-input fs-4 w-100' type="text" placeholder='<Enter a username>'
                value={username} onChange={handleUsername}/>
                <Button type='submit' className='main-button arrow w-100' disabled={!username}>Submit</Button>
            </form>
            </>
            : <EntryForm />
        }
        </div>
    );
}

export default Home;