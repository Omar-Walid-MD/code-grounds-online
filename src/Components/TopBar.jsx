import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { games } from '../Games/games';
import { BiStats } from 'react-icons/bi';
import { useNavigate } from 'react-router';
import { MdHourglassBottom } from 'react-icons/md';

function TopBar({playingRoom,setStatusModal,onTimerEnd,onTimerTick}) {

    const navigate = useNavigate();
    const [fullTime,setFullTime] = useState(0);
    const [timeLeft,setTimeLeft] = useState(0);

    const [leaveModal,setLeaveModal] = useState(false);

    function updateTimeLeft()
    {
        const newTimeLeft = Math.ceil(Math.max(fullTime - (Date.now()-playingRoom.startTime)/1000,0));
        setTimeLeft(newTimeLeft);
    }

    useEffect(()=>{

        let timer = null;
        if(playingRoom)
        {
            updateTimeLeft();
            timer = setInterval(() => {
                if(timeLeft <= 0)
                {
                  onTimerEnd();
                  clearInterval(timer); 
                }
                else
                {
                    updateTimeLeft();
                    if(onTimerTick) onTimerTick();

                }
            }, 1000);
            
        }

        return ()=> {clearInterval(timer);};
    },[timeLeft,playingRoom]);

    useEffect(()=>{
        if(playingRoom)
        {
            setFullTime(playingRoom.fullTime);
            setTimeLeft(playingRoom.fullTime);
        }
    },[playingRoom]);

    return (
        <>
            <Row className='w-100 g-0 dark-bg shadow'>
                <Col className='col-12 col-md-4'>
                    <div className='d-flex justify-content-center justify-content-md-start align-items-center'>
                        <div className='fs-3 py-2 px-4 fw-bold'>
                            {playingRoom && games.find((g) => g.code === playingRoom.gameMode).title}
                        </div>
                        
                        <div className='comment'>{playingRoom && playingRoom.users.length} players </div>
                        
                    </div>
                    
                </Col>
                <Col className='col-12 col-md-4 p-2 px-4 px-md-2'>
                    <div className="d-flex w-100 flex-column justify-content-center align-items-center gap-2">
                        <div className="d-flex gap-2 align-items-center">
                            <MdHourglassBottom className={(timeLeft >= 60 || !timeLeft) ? "text-s" : "text-d time-up-icon"} size={25}/>
                            <p className='m-0 fs-5'>
                            {
                                timeLeft ?
                                <>
                                    {("0"+Math.floor(timeLeft/60)).slice(-2)}:{("0"+Math.floor(timeLeft%60)).slice(-2)}
                                </>
                                :
                                <>{fullTime}:00</>
                            }
                            </p>
                        </div>
                        <div className="w-100 time-bar-bg bg-white overflow-hidden">
                            <div className={`${(timeLeft >= 60 || !timeLeft) ? "secondary-bg" : "danger-bg"} time-bar-fill`} style={{height:5,width:`${timeLeft/fullTime*100}%`}}></div>
                        </div>
                    </div>
                </Col>
                <Col className='col-12 col-md-4 p-2'>
                    <div className="w-100 d-flex align-items-center justify-content-center justify-content-md-end gap-3">
                        <Button className='main-button secondary' onClick={()=>setStatusModal(true)}>
                            <BiStats size={20} className='me-2'/>
                            Stats
                        </Button>
                        <Button className='main-button arrow danger' onClick={()=>setLeaveModal(true)}>
                            Leave Game
                        </Button>
                    </div>
                </Col>
            </Row>
            
            <Modal show={leaveModal}
            contentClassName='dark-bg text-white font-mono rounded-0 border border-2 border-white'
            centered
            onHide={()=>setLeaveModal(false)}
            >
                <Modal.Body className='text-center'>
                    <h3>Are you sure you want to leave the game?</h3>
                    <p className='text-d'>(Progress in this game would be lost.)</p>
                </Modal.Body>
                <Modal.Footer className='border-0 d-flex justify-content-center gap-3'>
                    <Button className='main-button arrow danger' onClick={()=>navigate("/")}>
                        Leave Game
                    </Button>
                    <Button className='main-button arrow secondary' onClick={()=>setLeaveModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TopBar;