import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import { setWebsocket, setLastJsonMessage } from '../Store/Websocket/websocketSlice';
import { useNavigate } from 'react-router';
import { socket } from '../socketClient/socketClient';

function WaitingRoom({gameMode}) {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(store => store.auth.user);

    const [waitingRoom,setWaitingRoom] = useState();
    const waitingRoomRef = useRef(waitingRoom);

    const [timerStarted,setTimerStarted] = useState(false);

    useEffect(()=>{
        socket.emit("join_room",{
            gameMode,
            user
        });
        console.log("sent socket")
    },[]);

    useEffect(()=>{
        socket.on("get_room",(room)=>{
            setWaitingRoom(room);
        });

    },[socket]);

    useEffect(()=>{
        if(waitingRoom)
        {
            if(waitingRoom.users.length >= 2)
            {
                if(!timerStarted) setTimerStarted(true);

                if(waitingRoom.state === "running")
                {
                    navigate(`/${gameMode}`,{state:{roomId:waitingRoom.id}});
                }
            }
            else if(timerStarted)
            {

                setTimerStarted(false);
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
    

    return (
        <Container className='d-flex flex-column align-items-center gap-3'>
            <h2 className='text-capitalize dark-bg p-3 shadow'>Starting &#123;{waitingRoom && <span className='text-accent'>{waitingRoom.gameMode}</span>}&#125; Game</h2>
            {
                timerStarted ? 
                <WaitingTimer waitingRoom={waitingRoom} />
                : <h4 className='text-accent loading'>Waiting for more players...</h4>
            }
            <hr className='w-75 border-3 mt-0'/>
            <div className='d-flex  w-100 flex-column align-items-start'>
                <p className='fs-5'>const players = [</p>

                <Row className='align-self-center'>
                {
                    waitingRoom &&
                    waitingRoom.users.map((waitingUser,index)=>

                    <Col key={waitingUser.userId}>
                        <div className="d-flex gap-3 align-items-end">
                            <div className={`dark-bg d-flex align-items-center gap-5 pe-5 shadow ${waitingUser.userId ===user.userId ? "border-bottom border-4 border-white" : ""}`}>
                                <img
                                className='user-avatar border-4'
                                src={waitingUser.avatar}
                                style={{height:70}}
                                />
                                <h3 className='m-0'>{waitingUser.username}</h3>
                            </div>
                            {index !== waitingRoom.users.length-1 &&  <p className='m-0 fs-5'>,</p>}
                        </div>
                    </Col>
                    )
                }
                </Row>

                <p className='fs-5'>];</p>
            </div>
           
        </Container>
    );
}


function WaitingTimer({waitingRoom})
{
    const fullTime = 5;
    const [startTime,setStartTime] = useState(Date.now());
    const [timeLeft,setTimeLeft] = useState(fullTime);

    console.log(timeLeft);

    useEffect(()=>{

        let timer = setInterval(() => {
            if(timeLeft <= 0)
            {
                clearInterval(timer);
                console.log("time up");
                socket.emit("update_room",{
                    roomId: waitingRoom.id,
                    update: {
                        state: "running",
                        startTime: Date.now()
                    }
                });

            }
            else
            {
                const newTimeLeft = Math.max(fullTime - (Date.now()-startTime)/1000,0);
                setTimeLeft(newTimeLeft);

            }
        }, 1000);
            

        return ()=> {clearInterval(timer);};
    },[timeLeft]);

    return (
        <div>
            <h3 className="text-accent loading">Starting in {Math.round(timeLeft)} seconds...</h3>
        </div>
    )
}

export default WaitingRoom;