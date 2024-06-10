import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import { getCodeOutput, testCode } from '../codeAPI/api';
import { codeSnippets, languages, questionLoopCode, wrapCode } from '../codeAPI/langauges';

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

const fullTime = 5 * 60;

function Quiz({}) {

    const [quizState,setQuizState] = useState("running");
    const [questionIndex,setQuestionIndex] = useState(0);
    const [questionLoading,setQuestionLoading] = useState(false);

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

            if(newSolvedQuestions.length === questions.length)
            {
                setResultModal("end");
                socket.emit("update_room",{
                    roomId,
                    update: {
                        results: playingRoom.users
                    }
                });
            }
            else
            {
                setResultModal("correct");
            }

        }
        else
        {
            setResultModal("incorrect");
        }
    }

   
    function getSortedRankings(playingUsers)
    {
        playingUsers = [...playingUsers];
        playingUsers.sort((a,b) => {
            if(a.state && b.state) return a.state.solvedQuestions.length - b.state.solvedQuestions.length;
            else return false;
        }).reverse();
        
        return playingUsers;
    }

    function getRankingString(playingUsers)
    {
        playingUsers = getSortedRankings(playingUsers);
        const rank = playingUsers.findIndex((u) => u.userId === user.userId) + 1;

        const strings = ["1st","2nd","3rd"];
        if(rank <= 3) return strings[rank-1];
        else return `${rank}th`;
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
                if(questions)
                {
                    room.users.forEach((user)=>{
                        if(user.state)
                        {
                            if(user.state.solvedQuestions.length === questions.length)
                            {
                                setQuizState("results");
                                setResultModal("end");
                                console.log("here ending");
                            }
                        }
                    });
                }
                else
                {
                    if(room.questions)
                    {
                        setQuestions(room.questions);
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


                    <div className='w-100'>
                        <p className="fs-5 text-bright mb-1">Questions</p>
                        <div className="questions-scroll overflow-x-scroll mb-3"
                        onWheel={(e)=>{
                            e.currentTarget.scrollTo({left:e.currentTarget.scrollLeft + Math.sign(e.deltaY)*100});
                        }}
                        >

                            <div className="d-flex pb-2 gap-2" style={{width:"fit-content"}}>
                            {
                                questions && questions.map((question,i)=>

                                <div className={`position-relative d-flex align-items-start justify-content-start border-bottom border-white ${i==questionIndex ? "border-3 text-white" : " border-bottom-0 text-accent"}`} style={{width:260}}>
                                    <Button className='w-100 fs-5 rounded-0 bg-dark border-0'
                                    style={{color:"unset"}}
                                    onClick={()=>{
                                        setQuestionIndex(i);
                                        setCurrentTab(0);
                                    }}
                                    >
                                    {question.title}
                                    </Button>


                                    {
                                        solvedQuestions.includes(i) &&
                                        <div className='d-flex bg-success align-items-center justify-content-center h-100 px-1' bg="success" style={{right:0,top:0}}>
                                            <FaCheck color='white' size={15} />
                                        </div>
                                    }


                                    <div className='position-absolute d-flex align-items-center justify-content-center gap-2'
                                    style={{width:"min(200px,18vw)",bottom:"-40px"}}
                                    >
                                    </div>
                                </div>
                                )
                            }
                            </div>
                        </div>
                    </div>
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
                                    <Row>
                                        <Col className='col-12'>
                                            <div className="d-flex flex-column gap-2" style={{height:435}}>
                                                <div className="h-100 p-3 dark-bg d-flex flex-column align-items-start">
                                                    <p className='fs-4 fw-semibold border-bottom border-white border-3'>{questionIndex+1}. {questions[questionIndex].title}</p>
                                                    <p className='fs-5'>{questions[questionIndex].question}</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    

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
                    <p className='text-bright fs-5 fw-semibold'>{getRankingString(playingRoom.results)==="1st" ? "We have a winner! You placed 1st place!" : `Game Over! You placed ${getRankingString(playingRoom.results)} place`}</p>
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
                    navigate("/play");
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

export default Quiz;