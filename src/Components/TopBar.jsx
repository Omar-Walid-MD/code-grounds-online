import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { games } from '../Games/games';
import { BiStats } from 'react-icons/bi';
import { useNavigate } from 'react-router';
import { MdHourglassBottom } from 'react-icons/md';

function TopBar({playingRoom,timeLeft,fullTime,setStatusModal}) {

    const navigate = useNavigate();

    return (
        <Row className='w-100 g-0 dark-bg shadow'>
            <Col className='col-4'>
                <div className='d-flex align-items-center'>
                    <div className='fs-3 py-2 px-4 fw-bold'>
                        {playingRoom && games.find((g) => g.code === playingRoom.gameMode).title}
                    </div>
                    
                    <div className='comment'>{playingRoom && playingRoom.users.length} players </div>
                    
                </div>
                
            </Col>
            <Col className='col-4 p-2'>
                <div className="d-flex w-100 flex-column align-items-center gap-2">
                    <div className="d-flex gap-2 align-items-center">
                        <MdHourglassBottom className={timeLeft >= 60 ? "text-s" : "text-d time-up-icon"} size={25}/>
                        <p className='m-0 fs-5'>
                            {("0"+Math.floor(timeLeft/60)).slice(-2)}:{("0"+Math.floor(timeLeft%60)).slice(-2)}
                        </p>
                    </div>
                    <div className="w-100 time-bar-bg bg-white overflow-hidden">
                        <div className={`${timeLeft >= 60 ? "secondary-bg": "danger-bg"} time-bar-fill`} style={{height:5,width:`${timeLeft/fullTime*100}%`}}></div>
                    </div>
                </div>
            </Col>
            <Col className='col-4 p-2'>
                <div className="w-100 d-flex align-items-center justify-content-end gap-3">
                    <Button className='main-button secondary' onClick={()=>setStatusModal(true)}>
                        <BiStats size={20} className='me-2'/>
                        Stats
                    </Button>
                    <Button className='main-button arrow danger' onClick={()=>navigate("/play")}>
                        Leave Game
                    </Button>
                </div>
            </Col>
        </Row>
    );
}

export default TopBar;