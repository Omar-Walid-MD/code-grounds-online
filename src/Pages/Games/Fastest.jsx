import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import { getCodeOutput, testCode } from '../../codeAPI/api';
import { getSortedRankings, getRankingString } from '../../Helpers/rankings';

import { MdWarning } from "react-icons/md";
import { MdHourglassBottom } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { BiStats } from "react-icons/bi";
import { IoCheckboxSharp } from "react-icons/io5";

import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../socketClient/socketClient';
import { useLocation, useNavigate } from 'react-router';
import { games } from '../../Games/games';
import CodeSubmit from '../../Components/CodeSubmit';
import TopBar from '../../Components/TopBar';
import QuestionTab from '../../Components/QuestionTab';
import UserAvatar from '../../Components/UserAvatar';
import { updateUserCompletedGames } from '../../Firebase/DataHandlers/users';
import { auth } from '../../Firebase/firebase';
import StatusModal from '../../Components/StatusModal';

const waitTime = 2;

function Fastest({}) {

    const [quizState,setQuizState] = useState("running");
    const [questionIndex,setQuestionIndex] = useState(0);

    const [questions,setQuestions] = useState();

    const [currentTab,setCurrentTab] = useState(0);
    
    const [timeUp,setTimeUp] = useState(false);

    const [resultModal, setResultModal] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const user = useSelector(store => store.auth.user);

    const [roomId,setRoomId] = useState();

    const [playingRoom,setPlayingRoom] = useState();

    const [statusModal, setStatusModal] = useState(false);

    async function submitAnswer(codeValues,languageValues,questions)
    {
        const correct = await testCode(codeValues[questionIndex],languageValues[questionIndex],questions[questionIndex]);
        if(correct)
        {
            const solvedQuestions = getSolvedQuestions();
            let newSolvedQuestions = solvedQuestions;
            if(!solvedQuestions.includes(questionIndex))
            {
                newSolvedQuestions = [...solvedQuestions,questionIndex];
                socket.emit("update_user_in_room",{
                    roomId: roomId,
                    userId: user.userId,
                    update: {
                        state:
                        {
                            solvedQuestions: newSolvedQuestions
                        }
                    }
                })
            }
            
            if(questionIndex === questions.length-1)
            {
                socket.emit("update_room",{
                    roomId,
                    update: {
                        results: playingRoom.users,
                        questionIndex: questionIndex + 1
                    }
                });
                endGame();
            }
            else
            {
                console.log("here should work");
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

    function getSolvedQuestions()
    {
        let solvedQuestions = [];
        if(playingRoom && user)
        {
            solvedQuestions = playingRoom.users.find((u) => u.userId === user.userId).state.solvedQuestions;
        }

        return solvedQuestions;
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

    function endGame()
    {
        setStatusModal(false);
        setResultModal("end");
        setQuizState("results");
        if(auth.currentUser) updateUserCompletedGames(user.userId,playingRoom.gameMode,getRankingString(playingRoom.users,user)==="1st");
    }

    function onTimerEnd()
    {
        setTimeUp(true);
        if(resultModal !== "end")
        {
            socket.emit("update_room",{
                roomId,
                update: {
                    results: playingRoom.users
                }
            });
            endGame();

        }
    }

    function onTimerTick()
    {
        if(playingRoom?.untilNextQuestion)
        {
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
    }

    useEffect(()=>{
        if(location.state && user) setRoomId(location.state.roomId);
        else navigate("/");
    },[]);

  

    useEffect(()=>{
        socket.on("get_room",(room)=>{
            setPlayingRoom(room);

            if(room)
            {
                if(room.questions)
                {
                    setQuestions(room.questions);
                    setQuestionIndex(room.questionIndex);

                    if(room.questionIndex === room.questions.length)
                    {
                        endGame();
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
        if(roomId && user)
        socket.emit("update_user_in_room",{
            roomId: roomId,
            userId: user.userId,
            update: {
                online: true
            }
        })
        
    },[roomId,user]);


    useEffect(()=>{

        const keyBind = (e)=>{
            if(e.altKey)
            {
                if(e.key==='q')
                {
                    setCurrentTab(0);
                }
                else if(e.key==='w')
                {
                    setCurrentTab(1);
                }
            }
        };
        document.body.addEventListener("keydown",keyBind);

        return ()=>{
            document.body.removeEventListener("keydown",keyBind);
        }
    },[questions]);


    return (
        <div className='page-container px-3 font-mono text-white position-relative pt-4 d-flex flex-column justify-content-start align-items-center'>
                    
        <Container className='d-flex flex-column justify-content-center align-items-center'>

        { 
            quizState==="running" &&
            <div className="d-flex w-100 flex-column gap-4">
                
                <TopBar
                playingRoom={playingRoom}
                setStatusModal={setStatusModal}
                onTimerEnd={onTimerEnd}
                onTimerTick={onTimerTick}
                />                

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
                                    solvedQuestions={getSolvedQuestions()}

                                    />
                                </Col>
                            </Row>
                        </div>
                    </div>
                }
            </div>
        }
        </Container>

        <CountdownModal
        show={playingRoom?.untilNextQuestion >= Date.now()}
        questionSolver={getQuestionSolver()}
        playingRoom={playingRoom}
        user={user}
        />

        

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
                    {timeUp && <p className='text-accent fs-5 fw-semibold'>Time is up!</p>}
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


        <StatusModal
        statusModal={statusModal}
        setStatusModal={setStatusModal}
        playingUsers={getSortedRankings(playingRoom?.users || [])}
        questions={questions}
        user={user}
        />

            
        </div>
    );
}



function CountdownModal({show, questionSolver,playingRoom,user}) {

    const [flip,setFlip] = useState(true);
    useEffect(()=>{
        let timer;
        if(show)
        {
            timer = setInterval(() => {
                setFlip(!flip);
            }, 1000);
            
        }

        return ()=> {clearInterval(timer);};
    },[show]);

    return (
        <Modal show={show}
        backdrop="static"
        contentClassName='dark-bg text-white font-mono rounded-0 border border-2 border-white'
        keyboard={false}
        centered
        >
            <Modal.Body className='d-flex flex-column align-items-center p-4 gap-3 text-center'>
            {
                playingRoom?.users && playingRoom?.questionIndex > 0 && questionSolver &&
                questionSolver?.userId === user?.userId ?
                    
                <>
                    <IoCheckboxSharp className='scale-in text-accent' size={100} />
                    <p className='text-accent fs-5 fw-semibold'>Great job! You gained a point!</p>
                </>
                :
                <>
                    <UserAvatar src={questionSolver?.avatar} className='border scale-in border-4' style={{height:80}}/>
                    <p className='text-accent fs-5 fw-semibold'>This Question has been solved by <span className='text-white'>{questionSolver?.username}</span></p>
                </> 
                    
                
            }
                <p className='text-accent fs-5 fw-semibold'>Next Question In: {Math.ceil(Math.max((playingRoom?.untilNextQuestion-Date.now())/1000,0))}</p>

            </Modal.Body>
            {
                playingRoom?.untilNextQuestion >= Date.now()
            }
        </Modal>
    );
}


export default Fastest;