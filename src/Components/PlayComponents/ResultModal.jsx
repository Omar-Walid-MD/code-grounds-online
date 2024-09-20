import React from 'react';
import { getRankingString, getSortedRankings } from '../../Helpers/rankings';
import Button from '../Button';
import { useNavigate } from 'react-router';

import { MdWarning } from "react-icons/md";
import { IoCheckboxSharp } from "react-icons/io5";
import { Col, Modal, Row } from 'react-bootstrap';
import UserAvatar from '../UserAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { disableTutorialPopups } from '../../Store/Settings/settingsSlice';


function ResultModal({mode,playingRoom,setResultModal,timeUp,questions}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(store => store.auth.user);

    return (
        <Modal show={mode!==""}
        backdrop="static"
        contentClassName='main-bg text-white font-mono rounded-0 border border-2 border-white'
        keyboard={false}
        centered
        >
            <Modal.Body className='d-flex flex-column align-items-center p-4 gap-3 text-center'>
            {
                mode === "correct" ?
                <>
                    <IoCheckboxSharp className='scale-in text-bright' size={100} />
                    <p className='text-bright fs-5 fw-semibold'>Correct Answer! Great job!</p>
                </>
                : mode === "incorrect" ?
                <>
                    <MdWarning className='scale-in text-danger' size={100} />
                    <p className='text-danger fs-5 fw-semibold'>Incorrect Answer...</p>
                </>
                : mode === "end" && playingRoom.results &&
                <>
                    {timeUp && <p className='fs-5 fw-semibold'>Time is up!</p>}
                    <p className='text-bright fs-5 fw-semibold'>
                    {
                        getRankingString(playingRoom.results,user)==="1st" ?
                        "We have a winner! You placed 1st place!" :
                        `Game Over! You placed ${getRankingString(playingRoom.results,user)} place`}
                    </p>
                {
                    getSortedRankings(playingRoom.results).map((playingUser,i)=>

                    <Row className='w-100 position-relative fs-5'>
                        

                        <Col className='col-2 d-flex align-items-center justify-content-center'>
                            {playingUser.userId === user.userId && <div className="spinning-arrow position-absolute me-5"></div>}
                            {i+1}
                        </Col>
                        <Col className='col-6'>
                            <div className='w-100 d-flex align-items-center justify-content-start gap-3 shadow'>
                                <div className="d-flex align-items-center gap-2">
                                    <UserAvatar
                                    className='border-3 border'
                                    src={playingUser.avatar}
                                    style={{height:40}}
                                    />
                                </div>
                                <p className='m-0'>{playingUser.username}</p>
                            </div>
                        </Col>
                        <Col className='col-4 d-flex align-items-center justify-content-center'>{playingUser.state.solvedQuestions.length}/{questions.length}</Col>
                    </Row>
                    )
                }
                </>

            }
            </Modal.Body>
            <Modal.Footer className='border-0'>
            {
                mode === "correct" ?
                <Button className='main-button arrow w-100 fs-5' onClick={()=>{
                    setResultModal("");
                }}>
                    Keep going!
                </Button>
                : mode === "incorrect" ?
                <Button className='main-button danger arrow w-100 fs-5' onClick={()=>setResultModal("")}>
                    Try Again
                </Button>
                : mode === "end" &&
                <Button className='main-button arrow w-100 fs-5' onClick={()=>{
                    dispatch(disableTutorialPopups())
                    navigate("/");
                }}>
                    End Quiz
                </Button>
            }
            </Modal.Footer>
        </Modal>
    );
}

export default ResultModal;
