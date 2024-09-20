import React, { useEffect, useRef, useState } from 'react';
import { Button as BS_Button, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Button from '../../Components/Button';
import { getCodeAnswerResult } from '../../codeAPI/api';
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
import ResultModal from '../../Components/PlayComponents/ResultModal';
import TutorialPopup from '../../Components/TutorialPopup';

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


    async function submitAnswer(codeValues,languageValues,questions)
    {
        const correct = await getCodeAnswerResult(codeValues[questionIndex],languageValues[questionIndex],questions[questionIndex]);
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
                setCurrentTab(0);
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

                    let gameEnded = false;

                    room.users.forEach((playingUser)=>{
                        if(playingUser.state && user)
                        {

                            if(playingUser.state.solvedQuestions.length === room.questions.length && playingUser.userId!==user.userId)
                            {
                                gameEnded = true;
                            }
                        }
                    });

                    if(gameEnded) endGame();
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
                                            <div className='tutorial-popup-container justify-content-center'>
                                                <div className='scrollbar mb-3' style={{height:"500px"}}>
                                                    <div className='d-flex flex-column pb-4' style={{width:"auto"}}>
                                                    {
                                                        questions && questions.map((question,i)=>
                                                        
                                                            <div className={`d-flex w-100 container-border border-top-0 border-start-0 ${i==questionIndex ? "text-white bg-secondary" : "  text-accent"}`}>
                                                                <BS_Button variant='transparent' className='w-100 text-center fs-5 rounded-0 border-0 p-2'
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
                                                                    <div className='d-flex bg-primary align-items-center justify-content-center px-1' style={{right:0,top:0}}>
                                                                        <FaCheck color='white' size={15} />
                                                                    </div>
                                                                }
                                                                
                                                            </div>
                                                        )
                                                    }
                                                    </div>
                                                </div>
                                                <TutorialPopup text={"Questions of the game"} position='top'/>
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


        <ResultModal
        mode={resultModal}
        playingRoom={playingRoom}
        setResultModal={setResultModal}
        timeUp={timeUp}
        questions={questions}
        />


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