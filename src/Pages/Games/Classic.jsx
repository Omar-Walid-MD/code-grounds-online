import React, { useEffect, useRef, useState } from 'react';
import { Button as BS_Button, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Button from '../../Components/Button';
import { getCodeOutput, testCode } from '../../codeAPI/api';
import { getSortedRankings, getRankingString } from '../../Helpers/rankings';
import { updateUserCompletedGames } from '../../Firebase/DataHandlers/users';

import { MdWarning } from "react-icons/md";
import { FaQuestion, FaCode } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { BiStats } from "react-icons/bi";
import { IoCheckboxSharp } from "react-icons/io5";

import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../socketClient/socketClient';
import { useLocation, useNavigate } from 'react-router';

import CodeSubmit from '../../Components/PlayComponents/CodeSubmit';
import TopBar from '../../Components/PlayComponents/TopBar';
import QuestionTab from '../../Components/PlayComponents/QuestionTab';
import UserAvatar from '../../Components/UserAvatar';
import { auth } from '../../Firebase/firebase';
import { updateUser } from '../../Store/Auth/authSlice';
import StatusModal from '../../Components/PlayComponents/StatusModal';
import SideBar from '../../Components/PlayComponents/SideBar';
import { playAudio } from '../../Store/Audio/audioSlice';

function Classic({}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const user = useSelector(store => store.auth.user);

    const [roomId,setRoomId] = useState();

    const [playingRoom,setPlayingRoom] = useState();

    const [quizState,setQuizState] = useState("running");
    const [questionIndex,setQuestionIndex] = useState(0);

    const [questions,setQuestions] = useState();

    const [currentTab,setCurrentTab] = useState(0);
    
    const [timeUp,setTimeUp] = useState(false);

    const [resultModal, setResultModal] = useState("");
    const [statusModal, setStatusModal] = useState(false);

    const questionsScroll = useRef();


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

            if(newSolvedQuestions.length === questions.length)
            {
                socket.emit("update_room",{
                    roomId,
                    update: {
                        results: playingRoom.users
                    }
                });
                endGame();
            }
            else
            {
                dispatch(playAudio("correct"));
                setResultModal("correct");
            }

        }
        else
        {
            dispatch(playAudio("incorrect"));
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

    async function endGame()
    {
        dispatch(playAudio("end"));
        setStatusModal(false);
        setResultModal("end");
        setQuizState("results");
        if(auth.currentUser && !auth.currentUser.isAnonymous)
        {
            const updatedStats = await updateUserCompletedGames(user.userId,playingRoom.gameMode,getRankingString(playingRoom.users,user)==="1st");
            dispatch(updateUser({stats:updatedStats}))
        }
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
                    room.users.forEach((playingUser)=>{
                        if(playingUser.state && user)
                        {

                            if(playingUser.state.solvedQuestions.length === room.questions.length)
                            {
                                endGame();
                            }
                        }
                    });
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
    },[socket,roomId,user]);

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
                else if(parseInt(e.key) > 0 && parseInt(e.key) <= questions.length)
                {
                    setQuestionIndex(parseInt(e.key)-1);
                    setCurrentTab(0);
                }
            }
        };
        document.body.addEventListener("keydown",keyBind);

        return ()=>{
            document.body.removeEventListener("keydown",keyBind);
        }
    },[questions]);



    return (
        <div className='page-container main-bg px-3 font-mono text-white position-relative pt-4 d-flex flex-column justify-content-start align-items-center'>
                    
            <Container fluid className='d-flex flex-column justify-content-center align-items-center px-3 px-lg-5'>

            { 
                quizState==="running" &&
                <div className="d-flex w-100 flex-column gap-5 gap-md-0">
                    
                    <TopBar
                    playingRoom={playingRoom}
                    setStatusModal={setStatusModal}
                    onTimerEnd={onTimerEnd}
                    />

                    {
                        questions &&
                        
                        <div className='w-100 d-flex flex-column flex-md-row'>
                            
                            <SideBar
                            currentTab={currentTab}
                            setCurrentTab={setCurrentTab}
                            />

                            <div className='w-100'>
                                {
                                    currentTab === 0 &&
                                    <div className='w-100 d-flex flex-column align-items-start'>
                                        <p className="w-100 fs-5 bg-primary px-3 m-0">Questions</p>
                                        <div className='w-100 d-flex flex-row'>
                                            <div className='scrollbar mb-3' style={{height:"500px"}}>
                                                <div className='d-flex flex-column pb-4' style={{width:"auto"}}>
                                                {
                                                    questions && questions.map((question,i)=>
                                                    
                                                        <div className={`position-relative w-100 py-2 container-border border-top-0 border-start-0 ${i==questionIndex ? "text-white bg-secondary" : "  text-accent"}`}>
                                                            <BS_Button variant='transparent' className='w-100 text-center fs-5 rounded-0 border-0'
                                                            style={{color:"unset"}}
                                                            onClick={()=>{
                                                                setQuestionIndex(i);
                                                                setCurrentTab(0);
                                                            }}
                                                            >
                                                            {question.title}
                                                            </BS_Button>
    
    
                                                            {
                                                                getSolvedQuestions().includes(i) &&
                                                                <div className='position-absolute top-0 d-flex bg-primary align-items-center justify-content-center h-100 px-1' style={{right:0,top:0}}>
                                                                    <FaCheck color='white' size={15} />
                                                                </div>
                                                            }
                                                            
                                                        </div>
                                                    )
                                                }
                                                </div>


                                           
                                            </div>
                                            <QuestionTab question={questions[questionIndex]} questionIndex={questionIndex} />
                                        </div>

                                    </div>  
                                    }
                                    <CodeSubmit
                                    visible={currentTab===1}
                                    onSubmit={submitAnswer}
                                    questions={questions}
                                    questionIndex={questionIndex}
                                    solvedQuestions={getSolvedQuestions()}

                                    />
                            </div>
                        </div>
                            
                            

                           
                    }
                </div>
            }
            </Container>


        <Modal show={resultModal!==""}
        backdrop="static"
        contentClassName='main-bg text-white font-mono rounded-0 border border-2 border-white'
        keyboard={false}
        centered
        >
            <Modal.Body className='d-flex flex-column align-items-center p-4 gap-3 text-center'>
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
                    {timeUp && <p className='fs-5 fw-semibold'>Time is up!</p>}
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

export default Classic;