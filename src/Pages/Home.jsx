import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import EntryForm from '../Components/EntryForm';
import { games } from '../Games/games';
import { auth } from '../Firebase/firebase';
import { setUser } from '../Store/Auth/authSlice';
import { registerUser, usernameExists } from '../Firebase/DataHandlers/users';
import { generateAvatar, generateAvatarString } from '../Helpers/avatar';
import { socket } from '../socketClient/socketClient';
import Button from '../Components/Button';
import Loading from '../Components/Loading';

function Home({}) {

    const navigate = useNavigate();

    const user = useSelector(store => store.auth.user);
    const loading = useSelector(store => store.auth.loading);

    const [username,setUsername] = useState("");
    const [stage,setStage] = useState(0);
    const [errorMessage,setErrorMessage] = useState("");

    const [runningRoom,setRunningRoom] = useState();

    const dispatch = useDispatch();

    function handleUsername(e)
    {
        if(e.target.value.length <= 20)
        {
            setUsername(e.target.value);
        }
    }

    async function userEnter(e)
    {
        e.preventDefault();

        if(await usernameExists(username))
        {
            setErrorMessage("Username is already taken")
        }
        else
        {
            const avatarString = generateAvatarString();
    
            registerUser(user.userId,{
                username: username,
                avatar: avatarString
            });
    
            const updatedUser = {
                userId: user.userId,
                email: user.email,
                username: username,
                avatar: avatarString
            }
            dispatch(setUser(updatedUser));
        }

    }

    useEffect(()=>{
        if(user?.username)
        {
            socket.emit("login",user);
        }
    },[user]);

    useEffect(()=>{
        socket.on("get_running_room",(room)=>{
            setRunningRoom(room);
        })
    },[socket])

    
    return (
        <div className='page-container main-bg px-3 d-flex flex-column align-items-center justify-content-center'>
        {
            loading ?
            <Loading />
            :
            user ?
            user.username ?
            <Container className='font-mono text-white d-flex flex-column align-items-center justify-content-center gap-2'>
            {
                runningRoom ?
                <RejoinRoom user={user} runningRoom={runningRoom} setRunningRoom={setRunningRoom}/>
                :
                <>
                    <h1>Choose Game</h1>

                    <Row className='mt-3 g-3'>
                    {
                        games.map((game)=>
                        
                            <Col className='col-12 col-lg-6' key={`game-col-${game.code}`}>
                                <div className='d-flex flex-column align-items-center container-border shadow p-3'>
                                    <h3>{game.title}</h3>
                                    <p className='comment'>{game.desc}</p>
                                    <Button
                                    className='w-100 mt-3 fs-5'
                                    arrow
                                    onClick={()=>{
                                        navigate("/wait",{state:{gameMode:game.code}})
                                    }}
                                    >Play</Button>
                                </div>
                            </Col>
                        )
                    }
                    </Row>
                </>
            }
            </Container>
            :
            <>
                <form className="entry-form-container font-mono d-flex flex-column align-items-center gap-3 text-white" onSubmit={userEnter}>
                <input className='main-input fs-4 w-100' type="text" placeholder='<Enter a username>'
                value={username} onChange={handleUsername}/>
                {errorMessage && <p className='m-0 px-2 bg-danger text-white shadow'>{errorMessage}</p>}

                <Button type='submit' className='main-button arrow w-100' disabled={!username}>Submit</Button>
            </form>
            </>
            : <EntryForm />
        }
        </div>
    );
}


function RejoinRoom({user,runningRoom,setRunningRoom}) {

    const [timeLeft,setTimeLeft] = useState();
    const navigate = useNavigate();

    function rejoinRunningRoom()
    {
        socket.emit("rejoin_room",{
            roomId: runningRoom.id,
            userId: user.userId
        });
        navigate(`/play`,{state:{gameMode: runningRoom.gameMode,roomId:runningRoom.id}});

    }

    function leaveRunningRoom()
    {
        socket.emit("exit_room",{
            roomId: runningRoom.id,
            userId: user.userId
        });
        setRunningRoom()
    }

    function updateTimeLeft()
    {
        const newTimeLeft = Math.ceil(Math.max(runningRoom.fullTime - (Date.now()-runningRoom.startTime)/1000,0));
        setTimeLeft(newTimeLeft);

    }

    useEffect(()=>{

        updateTimeLeft();
        let timer = setInterval(() => {
            updateTimeLeft();

            if(timeLeft <= 0)
                leaveRunningRoom();
        }, 1000);

        return ()=> {clearInterval(timer);};
    },[]);

    return (
        <div className='d-flex flex-column align-items-center dark-bg shadow p-3 w-100'>
            <h2>Resume <span className='text-bright'>&#123;{games.find((r) => r.code === runningRoom.gameMode).title}</span>&#125; game?</h2>
            <p className='comment'>
                {("0"+Math.floor(timeLeft/60)).slice(-2)}:{("0"+Math.floor(timeLeft%60)).slice(-2)}
            </p>
            <div className="d-flex align-items-center gap-3">
                <Button
                variant='secondary'
                arrow
                onClick={()=>rejoinRunningRoom()}
                >Rejoin</Button>

                <Button
                variant='danger'
                arrow
                onClick={()=>leaveRunningRoom()}
                >Leave</Button>
            </div>
        </div>
    );
}

export default Home;