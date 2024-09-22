import React, { useEffect, useRef, useState } from 'react';
import { Button as BS_Button, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Button from '../../Components/Button';
import { getCodeAnswerResult } from '../../codeAPI/api';
import { getSortedRankings, getRankingString } from '../../Helpers/rankings';
import { updateUserCompletedGames } from '../../Firebase/DataHandlers/users';

import { MdWarning } from "react-icons/md";


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
import { getQuestions } from '../../questions/questions';

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


function Bingo({}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const user = useSelector(store => store.auth.user);

    const [roomId,setRoomId] = useState();

    const [playingRoom,setPlayingRoom] = useState();

    const [quizState,setQuizState] = useState("running");
    const [questionIndex,setQuestionIndex] = useState(0);
    const [gridShown,setGridShown] = useState(true);

    const [questions,setQuestions] = useState();

    const [currentTab,setCurrentTab] = useState(0);
    
    const [timeUp,setTimeUp] = useState(false);

    const [resultModal, setResultModal] = useState("");
    const [statusModal, setStatusModal] = useState(false);


    async function submitAnswer(codeValues,languageValues,questions)
    {
        const correct = await getCodeAnswerResult(codeValues[questionIndex],languageValues[questionIndex],questions[questionIndex]);
        if(correct || true)
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

            if(checkForWin(newSolvedQuestions))
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
                setGridShown(true);
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

    function checkForWin(solvedQuestions)
    {
        const sortedSolvedQuestions = solvedQuestions.toSorted((a,b) => a - b);
        if(sortedSolvedQuestions.length < 5) return false;

        const possibleWins = [
            [0,1,2,3,4],
            [5,6,7,8,9],
            [10,11,12,13,14],
            [15,16,17,18,19],
            [20,21,22,23,24],

            [0,5,10,15,20],
            [1,6,11,16,21],
            [2,7,12,17,22],
            [3,8,13,18,23],
            [4,9,14,19,24],

            [0,6,12,18,24],
            [4,8,12,16,20]
        ];


        for (let i = 0; i < possibleWins.length; i++)
        {
            const possibleWinArray = possibleWins[i];

            let matches = 0;
            for (let j = 0; j < possibleWinArray.length; j++)
            {
                if(solvedQuestions.includes(possibleWinArray[j]))
                {
                   matches++; 
                }
                else
                {
                    break;
                }
                
            }
            if(matches===5)
            {
                return true;
            }
            
        }

        return false;
        
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
                                        {
                                            gridShown ?
                                            <TransformWrapper>
                                                <TransformComponent
                                                wrapperStyle={{
                                                    height: "100%",
                                                    width: "100%",
                                                  }}
                                                  contentStyle={{
                                                    height: "100%",
                                                    width: "100%",
                                                  }}
                                                >
                                                    <div className='w-100 d-flex justify-content-center'>
                                                        <div className='d-flex flex-row' style={{width:"500px",flexWrap:"wrap"}}>
                                                        {
                                                            (playingRoom?.questions?.length ? playingRoom.questions : getQuestions(25)).map((question,i)=>
                                                            
                                                                <BS_Button variant='transparent' className='p-2 border-0' style={{height:"100px",flex:"0 0 auto",width:"20%"}}
                                                                onClick={()=>{
                                                                    setGridShown(false);
                                                                    setQuestionIndex(i);
                                                                }}>
                                                                    <div className={`w-100 h-100 ${getSolvedQuestions().includes(i) ? "bg-primary" : "bg-black"} fs-3 d-flex align-items-center justify-content-center text-center text-white border border-1 border-white`}>
                                                                        {String.fromCharCode(65+i)}
                                                                        {i}
                                                                    </div>
                                                                </BS_Button>
                                                            
                                                            )
                                                        }
                                                        </div>
                                                    </div>
                                                </TransformComponent>
                                            </TransformWrapper>
                                            :
                                            <div className='w-100'>
                                                <Button className='m-3 mb-0 fs-6' arrow bordered
                                                onClick={()=>setGridShown(true)}>To Grid</Button>
                                                <QuestionTab question={questions[questionIndex]} questionIndex={questionIndex} />
                                            </div>
                                        }

                                            

                                    </div>  
                                    }
                                    <CodeSubmit
                                    visible={currentTab===1 && questionIndex !== null}
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

{/* 
        <StatusModal
        statusModal={statusModal}
        setStatusModal={setStatusModal}
        playingUsers={getSortedRankings(playingRoom?.users || [])}
        questions={questions}
        user={user}
        /> */}

            
        </div>
    );
}

export default Bingo;