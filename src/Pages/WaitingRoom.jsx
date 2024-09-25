import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { socket } from '../socketClient/socketClient';
import { games } from '../Games/games';
import UserAvatar from '../Components/UserAvatar';
import Button from '../Components/Button';

const minPlayers = 2;
const waitingSeconds = 3;

function WaitingRoom({}) {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(store => store.auth.user);
    const loading = useSelector(store => store.auth.loading);

    const gameMode = useLocation().state?.gameMode;

    const [waitingRoom,setWaitingRoom] = useState();
    const waitingRoomRef = useRef(waitingRoom);

    const [timerStarted,setTimerStarted] = useState(false);

    useEffect(()=>{
        if(gameMode && !loading && user)
        {
            socket.emit("join_room",{
                gameMode,
                user
            });
        }
        else navigate("/");
    },[loading,user]);  

    useEffect(()=>{
        socket.on("get_room",(room)=>{
            setWaitingRoom(room);
        });
    },[socket]);

    useEffect(()=>{
        if(waitingRoom)
        {
            if(waitingRoom.users.length >= minPlayers)
            {
                if(!timerStarted)
                {
                    setTimerStarted(true);
                    if(!waitingRoom.startTime)
                    {
                        socket.emit("set_room_start",{
                            roomId: waitingRoom.id,
                            startTime: Date.now() + waitingSeconds * 1000
                        });
                    }
                }    

                if(waitingRoom.state === "running")
                {
                    navigate(`/play`,{state:{gameMode,roomId:waitingRoom.id}});
                }
            }
            else if(timerStarted)
            {
                setTimerStarted(false);
                if(waitingRoom.startTime)
                {
                    socket.emit("set_room_start",{
                        roomId: waitingRoom.id,
                        startTime: null
                    })
                }
            }
        }

        waitingRoomRef.current = waitingRoom;
    },[waitingRoom]);


    useEffect(()=>{

        return ()=>{
            if(waitingRoomRef.current && user)
            {
                if(waitingRoomRef.current.state==="waiting")
                socket.emit("exit_room",{
                    roomId: waitingRoomRef.current.id,
                    userId: user.userId
                });
            }
        }
    },[]);

    useEffect(()=>{
        if(!loading && !user) navigate("/");
    },[loading,user]);
    
    return (
        <div className='page-container main-bg px-3 font-mono text-white d-flex flex-column justify-content-center align-items-center'>
            <Container className='d-flex flex-column align-items-center gap-3'>
                <h2 className='text-capitalize p-3 shadow'>Starting &#123;{waitingRoom && <span className='text-bright'>{games.find((g)=>g.code===waitingRoom.gameMode)?.title}</span>}&#125; Game</h2>
                <div className='d-flex align-items-start justify-content-between'>
                {
                    timerStarted ? 
                    <WaitingTimer waitingRoom={waitingRoom} />
                    : <h4 className='text-accent loading'>Waiting for more players...</h4>
                }
                </div>
                <hr className='w-75 border-3 mt-0'/>
                <div className='d-flex w-100 flex-column align-items-start'>
                    <p className='fs-5'>
                        <span style={{color:"lightskyblue"}}>const</span>
                        <span style={{color:"#ffffba"}}> players</span>
                        <span> =</span>
                        <span style={{color:"#ff99ff"}}> [</span>
                    </p>

                    <Row className='g-3 align-self-center'>
                    {
                        waitingRoom && user &&
                        waitingRoom.users.map((waitingUser,index)=>

                        <Col key={waitingUser?.userId}>
                            <div className="d-flex gap-2 align-items-end justify-content-center justify-content-lg-start">
                                <div className={`d-flex align-items-center gap-5 pe-5 shadow ${waitingUser?.userId === user.userId ? "border-bottom border-4 border-white" : ""}`}>
                                    <UserAvatar
                                    className={`border-4 border-white ${waitingUser?.userId !== user.userId ? "border" : ""}`}
                                    src={waitingUser?.avatar}
                                    style={{height:70}}
                                    />
                                    <h3 className='m-0'>{waitingUser?.username}</h3>
                                </div>
                                {index !== waitingRoom.users.length-1 &&  <p className='m-0 fs-5'>,</p>}
                            </div>
                        </Col>
                        )
                    }
                    </Row>

                    <p className='fs-5'>
                        <span style={{color:"#ff99ff"}}>]</span>;
                    </p>
                </div>
                <div className='w-100 d-flex justify-content-center justify-content-md-start mt-5'>
                    <Button
                    variant='danger'
                    arrow
                    bordered
                    onClick={()=>navigate("/")}
                    >Leave</Button>
                </div>
            </Container>
        </div>
    );
}


function WaitingTimer({waitingRoom})
{
    const [timeLeft,setTimeLeft] = useState(waitingSeconds);

    useEffect(()=>{

        let timer = null;
        if(waitingRoom && waitingRoom.startTime)
        {
            timer = setInterval(() => {
                if(timeLeft <= 0)
                {
                    clearInterval(timer);
                    socket.emit("start_room",{
                        roomId: waitingRoom.id
                    });
    
                }
                else
                {
                    const newTimeLeft = Math.max((waitingRoom.startTime-Date.now())/1000,0);
                    setTimeLeft(newTimeLeft);
    
                }
            }, 1000);
        }

            

        return ()=> {clearInterval(timer);};
    },[waitingRoom,timeLeft]);

    return (
        <div>
            <h3 className="text-accent loading">Starting in {Math.round(timeLeft)} seconds...</h3>
        </div>
    )
}

export default WaitingRoom;