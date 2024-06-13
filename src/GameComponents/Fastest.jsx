import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import { getCodeOutput, testCode } from '../codeAPI/api';
import { getSortedRankings, getRankingString } from '../Helpers/rankings';

import { MdWarning } from "react-icons/md";
import { MdHourglassBottom } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { BiStats } from "react-icons/bi";
import { IoCheckboxSharp } from "react-icons/io5";

import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../socketClient/socketClient';
import { useLocation, useNavigate } from 'react-router';
import { games } from '../Games/games';
import CodeSubmit from '../Components/CodeSubmit';
import TopBar from '../Components/TopBar';
import QuestionTab from '../Components/QuestionTab';

const fullTime = 5 * 60;
const waitTime = 2;

function Fastest({}) {

    const [quizState,setQuizState] = useState("running");
    const [questionIndex,setQuestionIndex] = useState(0);

    const [questions,setQuestions] = useState();

    const [currentTab,setCurrentTab] = useState(0);
    
    const [timeLeft,setTimeLeft] = useState(fullTime);

    const [resultModal, setResultModal] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const user = useSelector(store => store.auth.user);

    const [roomId,setRoomId] = useState();

    const [playingRoom,setPlayingRoom] = useState();
    const [solvedQuestions,setSolvedQuestions] = useState([]);

    const [statusModal, setStatusModal] = useState(false);

    async function submitAnswer(codeValues,languageValues,questions)
    {
        const correct = await testCode(codeValues[questionIndex],languageValues[questionIndex],questions[questionIndex]);
        if(correct)
        {
            let newSolvedQuestions = solvedQuestions;
            if(!solvedQuestions.includes(questionIndex))
            {
                newSolvedQuestions = [...solvedQuestions,questionIndex];
                setSolvedQuestions(newSolvedQuestions);
            }

            if(questionIndex === questions.length-1)
            {
                setResultModal("end");
                socket.emit("update_room",{
                    roomId,
                    update: {
                        results: playingRoom.users,
                        questionIndex: questionIndex + 1
                    }
                });
            }
            else
            {
                socket.emit("update_room",{
                    roomId,
                    update: {
                        untilNextQuestion: Date.now() + waitTime * 1000,
                        questionIndex: questionIndex + 1
                    }
                });
            }

        }
        else
        {
            setResultModal("incorrect");
        }
    }

    function getQuestionSolver()
    {
        let questionSolver = null;
        playingRoom?.users.forEach((u)=>{
            if(u.state.solvedQuestions.includes(questionIndex-1))
            {
                questionSolver = u;
                return;
            }
        });
        return questionSolver;
    }

    useEffect(()=>{
        if(location.state && user) setRoomId(location.state.roomId);
        else navigate("/");
    },[]);

    useEffect(()=>{

        let timer = null;
        if(quizState==="running" && playingRoom)
        {
            
            timer = setInterval(() => {
                if(timeLeft <= 0)
                {
                    if(resultModal !== "end")
                    {
                        socket.emit("update_room",{
                            roomId,
                            update: {
                                results: playingRoom.users
                            }
                        });
                        clearInterval(timer);
                        setResultModal("end");
                        console.log("this here");
                    }
                }
                else
                {
                    const newTimeLeft = Math.ceil(Math.max(fullTime - (Date.now()-playingRoom.startTime)/1000,0));
                    setTimeLeft(newTimeLeft);

                    if(!newTimeLeft)
                    {
                        setStatusModal(false);
                    }

                }
            }, 1000);
            
        }

        return ()=> {clearInterval(timer);};
    },[quizState,timeLeft,playingRoom]);

    useEffect(()=>{
        socket.on("get_room",(room)=>{
            setPlayingRoom(room);

            if(room)
            {
                if(room.questions)
                {
                    setQuestions(room.questions);
                    setQuestionIndex(room.questionIndex);

                    console.log(room.questionIndex)
                    if(room.questionIndex === room.questions.length)
                    {
                        setQuizState("results");
                        setResultModal("end");
                        console.log("here ending");
                    }
                }
            }
        });

        return ()=>{
            if(roomId && user)
            socket.emit("exit_room",{
                roomId,
                userId: user.userId
            });
        }
    },[socket,roomId]);

    useEffect(()=>{
        if(playingRoom?.untilNextQuestion)
        {
            // console.log(playingRoom?.untilNextQuestion)
            if(playingRoom.untilNextQuestion < Date.now())
            {
                socket.emit("update_room",{
                    roomId,
                    update: {
                        untilNextQuestion: null
                    }
                });
                setCurrentTab(0);
            }
        }

    },[timeLeft]);

    useEffect(()=>{
        if(roomId && user)
        socket.emit("update_user_in_room",{
            roomId: roomId,
            userId: user.userId,
            updatedUser: {...user,state:{
                solvedQuestions
            }}
        })
        
    },[roomId, solvedQuestions]);


    return (
        <div className='page-container font-mono text-white position-relative pt-4 d-flex flex-column justify-content-start align-items-center'>
                    
        <Container className='d-flex flex-column justify-content-center align-items-center'>

        { 
            quizState==="running" &&
            <div className="d-flex w-100 flex-column gap-4">
                
                <TopBar playingRoom={playingRoom} timeLeft={timeLeft} fullTime={fullTime} setStatusModal={setStatusModal} />
                
                {
                    questions &&
                    <div className="d-flex flex-column justify-content-start">
                        <div className="d-flex gap-3 justify-content-start">
                            <Button className={`main-button ${currentTab === 0 ? "dark" : "bg-transparent border-0 shadow-sm"}`}
                            onClick={()=>setCurrentTab(0)}>Question</Button>
                            <Button className={`main-button px-4 ${currentTab === 1 ? "dark" : "bg-transparent border-0 shadow-sm"}`}
                            onClick={()=>setCurrentTab(1)}>Code</Button>
                        </div>
                        <div className='dark-bg p-3 shadow'>
                            {
                                currentTab === 0 &&
                                <QuestionTab question={questions[questionIndex]} questionIndex={questionIndex} />

                            }
                            <Row className={`${currentTab === 1 ? "g-4" : "g-0"}`}>
                                <Col className='col-12'>
                                    <CodeSubmit
                                    visible={currentTab === 1}
                                    onSubmit={submitAnswer}
                                    questions={questions}
                                    questionIndex={questionIndex}
                                    solvedQuestions={solvedQuestions}

                                    />
                                </Col>
                            </Row>
                        </div>
                    </div>
                }
            </div>
        }
        </Container>


        <Modal show={playingRoom?.untilNextQuestion >= Date.now()}
        backdrop="static"
        contentClassName='dark-bg text-white font-mono rounded-0 border border-2 border-white'
        keyboard={false}
        centered
        >
            <Modal.Body className='d-flex flex-column align-items-center p-4 gap-3 text-center'>
            {
                playingRoom?.users && questionIndex > 0 &&
                function()
                {
                    const questionSolver = getQuestionSolver();
                    if(!questionSolver) return "";

                    if(questionSolver.userId === user.userId)
                    {
                        return (
                        <>
                            <IoCheckboxSharp className='scale-in text-accent' size={100} />
                            <p className='text-accent fs-5 fw-semibold'>Great job! You gained a point!</p>
                        </>
                        )
                    }
                    else return (
                    <>
    
                        <img src={questionSolver.avatar} className='user-avatar border scale-in border-4' style={{height:80}}/>
                        <p className='text-accent fs-5 fw-semibold'>This Question has been solved by <span className='text-white'>{questionSolver.username}</span></p>
                    </> 
                    )
                }()
                
            }
                <p className='text-accent fs-5 fw-semibold'>Next Question In: {Math.ceil(Math.max((playingRoom?.untilNextQuestion-Date.now())/1000,0))}</p>

            </Modal.Body>
            {
                playingRoom?.untilNextQuestion >= Date.now()
            }
        </Modal>

        <Modal show={resultModal!==""}
        backdrop="static"
        contentClassName='dark-bg text-white font-mono rounded-0 border border-2 border-white'
        keyboard={false}
        centered
        >
            <Modal.Body className='d-flex flex-column align-items-center p-4 gap-3 '>
            {
                resultModal === "correct" ?
                <>
                    <IoCheckboxSharp className='scale-in text-accent' size={100} />
                    <p className='text-accent fs-5 fw-semibold'>Correct Answer! Great job!</p>
                </>
                : resultModal === "incorrect" ?
                <>
                    <MdWarning className='scale-in text-danger' size={100} />
                    <p className='text-danger fs-5 fw-semibold'>Incorrect Answer...</p>
                </>
                : resultModal === "end" && playingRoom.results &&
                <>
                    {timeLeft <= 0 && <p className='text-accent fs-5 fw-semibold'>Time is up!</p>}
                    <p className='text-bright fs-5 fw-semibold'>{getRankingString(playingRoom.results,user)==="1st" ? "We have a winner! You placed 1st place!" : `Game Over! You placed ${getRankingString(playingRoom.results,user)} place`}</p>
                {
                    getSortedRankings(playingRoom.results).map((playingUser,i)=>

                    <Row className='w-100 position-relative'>
                        

                        <Col className='col-2 d-flex align-items-center justify-content-center'>
                            {playingUser.userId === user.userId && <div className="spinning-arrow position-absolute me-5"></div>}
                            {i+1}
                        </Col>
                        <Col className='col-6'>
                            <div className='w-100 d-flex align-items-center justify-content-start gap-3 shadow'>
                                <div className="d-flex align-items-center gap-2">
                                    <img
                                    className='user-avatar border-3 border'
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
                resultModal === "correct" ?
                <Button className='main-button arrow w-100 fs-5' onClick={()=>{
                    setResultModal("");
                }}>
                    Keep going!
                </Button>
                : resultModal === "incorrect" ?
                <Button className='main-button danger arrow w-100 fs-5' onClick={()=>setResultModal("")}>
                    Try Again
                </Button>
                : resultModal === "end" &&
                <Button className='main-button arrow w-100 fs-5' onClick={()=>{
                    navigate("/");
                }}>
                    End Quiz
                </Button>
            }
            </Modal.Footer>
        </Modal>


        <Modal show={statusModal} onHide={()=>setStatusModal(false)} centered
        className='status-modal'
        contentClassName='dark-bg text-white font-mono rounded-0 border border-2 border-white'>
            <Modal.Header>
                <Modal.Title className='w-100 text-center fw-semibold'>
                   Quiz Status
                </Modal.Title>
                <Button className='position-absolute main-button me-2' style={{right:0}} onClick={()=>setStatusModal(false)}>Close</Button>
            </Modal.Header>
            <Modal.Body className='w-100'>
                <div className="w-100 d-flex flex-column justify-content-start align-items-start gap-3">

                    <Row className='w-100'>
                        <Col className='col-3'></Col>
                        {
                            questions && questions.map((question)=>
                            <Col className='text-center'>{question.title}</Col>
                            )
                        }
                    </Row>
                {
                    playingRoom && getSortedRankings(playingRoom.users).map((playingUser,i)=>
                    <Row className='w-100'>
                        <Col className='col-3'>
                            <div className='w-100 d-flex align-items-center justify-content-center gap-3 shadow'>
                                <div className="d-flex align-items-center gap-3">
                                    {playingUser.userId === user.userId && <div className="spinning-arrow position-absolute" style={{left:20}}></div>}
                                    {i+1}
                                    <img
                                    className='user-avatar border-3 border'
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
            </Modal.Body>
        </Modal>

            
        </div>
    );
}

export default Fastest;