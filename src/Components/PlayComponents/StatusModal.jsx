import React from 'react';
import { Col, Modal, Row, Button } from 'react-bootstrap';
import UserAvatar from '../UserAvatar';
import { FaCheck } from 'react-icons/fa';

function StatusModal({statusModal,setStatusModal,playingUsers,questions,user}) {
    return (
        <Modal show={statusModal} onHide={()=>setStatusModal(false)} centered
        className='status-modal'
        contentClassName='main-bg text-white font-mono rounded-0 border border-2 border-white'>
            <Modal.Header>
                <Modal.Title className='w-100 text-center fw-semibold'>
                   Quiz Status
                </Modal.Title>
                <Button className='position-absolute main-button me-2' style={{right:0}} onClick={()=>setStatusModal(false)}>Close</Button>
            </Modal.Header>
            <Modal.Body className='w-100'>
                <div className='w-100 overflow-x-scroll scrollbar pb-3'>
                    <div className="d-flex flex-column justify-content-start align-items-start gap-3"
                    style={{width:"1000px"}}>

                        <Row className='w-100'>
                            <Col className='col-3'></Col>
                            {
                                questions && questions.map((question)=>
                                <Col className='text-center'>{question.title}</Col>
                                )
                            }
                        </Row>
                    {
                        playingUsers?.map((playingUser,i)=>
                        <Row className={`w-100 ${playingUser?.online ? "text-white" : "text-danger"}`}>
                            <Col className='col-3'>
                                <div className='w-100 d-flex align-items-center justify-content-center gap-3 shadow position-relative'>
                                    <div className="d-flex align-items-center gap-2 justify-content-start overflow-hidden">
                                        {playingUser.userId === user.userId && <div className="spinning-arrow" style={{left:20}}></div>}
                                        {i+1}
                                        <UserAvatar
                                        className='border-3 border'
                                        src={playingUser.avatar}
                                        style={{height:40}}
                                        />
                                    </div>
                                    <p className='m-0'>{playingUser.username}</p>
                                </div>
                            </Col>
                            {
                                playingUser.state && questions && questions.map((question,i)=>
                                <Col className='d-flex align-items-center justify-content-center fs-3 text-accent'>{playingUser.state.solvedQuestions.includes(i) ? <FaCheck className='text-bright' /> : "--"}</Col>
                                )
                            }
                        </Row>
                        )
                    }
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default StatusModal;