import React, { useEffect, useState } from 'react';
import { Button as BS_Button, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Button from '../../Components/Button';
import { getCodeAnswerResult } from '../../codeAPI/api';
import { getSortedRankings, getRankingString } from '../../Helpers/rankings';

import { MdWarning } from "react-icons/md";
import { MdHourglassBottom } from "react-icons/md";
import { FaQuestion, FaCode } from "react-icons/fa";
import { BiStats } from "react-icons/bi";
import { IoCheckboxSharp } from "react-icons/io5";

import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../socketClient/socketClient';
import { useLocation, useNavigate } from 'react-router';

import CodeSubmit from '../../Components/PlayComponents/CodeSubmit';
import TopBar from '../../Components/PlayComponents/TopBar';
import QuestionTab from '../../Components/PlayComponents/QuestionTab';
import UserAvatar from '../../Components/UserAvatar';
import { updateUserCompletedGames } from '../../Firebase/DataHandlers/users';
import { auth } from '../../Firebase/firebase';
import StatusModal from '../../Components/PlayComponents/StatusModal';
import SideBar from '../../Components/PlayComponents/SideBar';
import { updateUser } from '../../Store/Auth/authSlice';
import ResultModal from '../../Components/PlayComponents/ResultModal';
import { playAudio } from '../../Store/Audio/audioSlice';

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
                dispatch(playAudio("correct"));
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
        <div className='page-container main-bg px-3 font-mono text-white position-relative pt-4 d-flex flex-column justify-content-start align-items-center'>
                    
            <Container fluid className='d-flex flex-column justify-content-center align-items-center px-3 px-lg-5'>

            { 
                quizState==="running" &&
                <div className="d-flex w-100 flex-column gap-5 gap-md-0">
                    
                    <TopBar
                    playingRoom={playingRoom}
                    setStatusModal={setStatusModal}
                    onTimerEnd={onTimerEnd}
                    onTimerTick={onTimerTick}
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
                                    <div className='w-100 d-flex flex-column'>
                                        <p className="fs-5 bg-primary px-3">Questions</p>
                                        <QuestionTab question={questions[questionIndex]} questionIndex={questionIndex} />
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

            <CountdownModal
            show={playingRoom?.untilNextQuestion >= Date.now()}
            questionSolver={getQuestionSolver()}
            playingRoom={playingRoom}
            user={user}
            />

            

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
        contentClassName='main-bg text-white font-mono rounded-0 border border-2 border-white'
        keyboard={false}
        centered
        >
            <Modal.Body className='d-flex flex-column align-items-center p-4 gap-3 text-center'>
            {
                playingRoom?.users && playingRoom?.questionIndex > 0 && questionSolver &&
                questionSolver?.userId === user?.userId ?
                    
                <>
                    <IoCheckboxSharp className='scale-in text-bright' size={100} />
                    <p className='text-bright fs-5 fw-semibold'>Great job! You gained a point!</p>
                </>
                :
                <>
                    <UserAvatar src={questionSolver?.avatar} className='border scale-in border-4' style={{height:80}}/>
                    <p className='text-bright fs-5 fw-semibold'>This Question has been solved by <span className='text-white'>{questionSolver?.username}</span></p>
                </> 
                    
                
            }
                <p className='text-white fs-5 fw-semibold'>Next Question In: {Math.ceil(Math.max((playingRoom?.untilNextQuestion-Date.now())/1000,0))}</p>

            </Modal.Body>
            {
                playingRoom?.untilNextQuestion >= Date.now()
            }
        </Modal>
    );
}


export default Fastest;