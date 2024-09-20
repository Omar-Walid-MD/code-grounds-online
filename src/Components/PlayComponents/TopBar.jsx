import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { games } from '../../Games/games';
import { BiStats } from 'react-icons/bi';
import { useNavigate } from 'react-router';
import { MdHourglassBottom } from 'react-icons/md';
import Button from '../Button';
import { playAudio } from '../../Store/Audio/audioSlice';
import { useDispatch } from 'react-redux';
import TutorialPopup from '../TutorialPopup';

function TopBar({playingRoom,setStatusModal,onTimerEnd,onTimerTick}) {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [fullTime,setFullTime] = useState(0);
    const [timeLeft,setTimeLeft] = useState(null);

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

                    if(timeLeft < 60)
                    {
                        dispatch(playAudio("countdown"));
                    }

                }
            }, 1000);
            
        }

        return ()=> {clearInterval(timer);};
    },[timeLeft,playingRoom]);

    useEffect(()=>{
        if(playingRoom)
        {
            const f = playingRoom.fullTime;
            setFullTime(f);
            setTimeLeft(f);
        }
    },[playingRoom]);

    return (
        <>
            <Row className='w-100 g-0 container-border border-top-0 border-start-0 border-end-0 pb-md-4'>
                <Col className='col-12 col-md-4'>
                    <div className='h-100 d-flex flex-row align-items-center gap-3'>
                        <div className='fs-3 fw-bold'>
                            {playingRoom && games.find((g) => g.code === playingRoom.gameMode).title}
                        </div>
                        <div className='comment mt-1'>{playingRoom && playingRoom?.users.length} player{playingRoom?.users.length>1 ? "s" : ""}</div>
                        
                    </div>
                    
                </Col>
                <Col className='col-12 col-md-4'>
                    <div className="tutorial-popup-container d-flex w-100 flex-column justify-content-center align-items-center gap-2">
                        <div className="d-flex gap-2 align-items-center">
                            <MdHourglassBottom className={(timeLeft >= 60 || timeLeft===null) ? "text-secondary" : "text-danger time-up-icon"} size={25}/>
                            <p className='m-0 fs-5'>
                            {
                                timeLeft!==null ?
                                <>
                                    {("0"+Math.floor(timeLeft/60)).slice(-2)}:{("0"+Math.floor(timeLeft%60)).slice(-2)}
                                </>
                                :
                                <>{fullTime}:00</>
                            }
                            </p>
                        </div>
                        <div className="w-100 time-bar-bg bg-white overflow-hidden">
                            <div className={`${(timeLeft >= 60 || timeLeft===null) ? "bg-secondary" : "bg-danger"} time-bar-fill`} style={{height:5,width:`${timeLeft/fullTime*100}%`}}></div>
                        </div>
                        <TutorialPopup text="Game Timer" position='bottom' />
                    </div>
                </Col>
                <Col className='col-12 col-md-4 pb-2'>
                    <div className="w-100 d-flex align-items-center justify-content-center justify-content-md-end gap-3">
                        <Button variant='secondary' bordered onClick={()=>setStatusModal(true)}>
                            <BiStats size={20} className='me-2'/>
                            Stats
                        </Button>
                        <Button variant='danger' arrow bordered onClick={()=>setLeaveModal(true)}>
                            Leave
                        </Button>
                    </div>
                </Col>
            </Row>
            
            <Modal show={leaveModal}
            contentClassName='main-bg text-white font-mono rounded-0 border border-2 border-white p-2'
            centered
            onHide={()=>setLeaveModal(false)}
            >
                <Modal.Body className='text-center'>
                    <h3>Are you sure you want to leave the game?</h3>
                    <p className='text-danger'>(Progress in this game would be lost.)</p>
                </Modal.Body>
                <Modal.Footer className='border-0 d-flex justify-content-center gap-3'>
                    <Button variant='danger' arrow bordered onClick={()=>navigate("/")}>
                        Leave Game
                    </Button>
                    <Button onClick={()=>setLeaveModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TopBar;