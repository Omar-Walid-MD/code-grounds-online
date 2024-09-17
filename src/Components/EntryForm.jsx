import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setUser } from '../Store/Auth/authSlice';
import { socket } from '../socketClient/socketClient';
import { generateAvatar, generateAvatarString } from '../Helpers/avatar';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { usernameExists } from '../Firebase/DataHandlers/users';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import Button from './Button';

function EntryForm({}) {

    const [username,setUsername] = useState("");
    const [stage,setStage] = useState(0);
    const [errorMessage,setErrorMessage] = useState("");

    const dispatch = useDispatch();

    function handleUsername(e)
    {
        if(e.target.value.length <= 20)
        {
            setUsername(e.target.value);
        }
    }


    async function userEnter(e)
    {
        e.preventDefault();
        if(await usernameExists(username))
        {
            setErrorMessage("Username is already taken")
        }
        else
        {
            setStage(1);
        }
    }

    function continueAsGuest()
    {
        signInAnonymously(auth).then(()=>{

            console.log("this should be it");
            const user = {
                userId: uuidv4(),
                username,
                avatar: generateAvatarString()
            }
            dispatch(setUser(user));
            localStorage.setItem("user",JSON.stringify(user));
        })
    }

    return (
        <>
        {
            stage===0 ?
            <form className="entry-form-containter font-mono d-flex flex-column align-items-center gap-3 text-white" onSubmit={userEnter}>
                <input className='main-input fs-4 w-100' type="text" placeholder='<Enter your name>'
                value={username} onChange={handleUsername}/>
                {errorMessage && <p className='m-0 px-2 danger-bg text-white shadow'>{errorMessage}</p>}

                <Button arrow type='submit' className='w-100' disabled={!username}>Join</Button>
                <p className='m-0 mt-3 comment fs-5'>or if you've been here before</p>
                <div className="d-flex align-items-center gap-4 w-100">
                    <Button type='button' arrow linkTo={"/login"} bordered className='w-100'>Log in</Button>
                </div>
            </form>
            : stage===1 &&
            <form className="entry-form-containter font-mono text-white text-center d-flex flex-column align-items-center gap-3 gap-md-5">
                <div style={{width:"min(350px,calc(100vw - 2rem)"}}>
                    <p className='m-0 mb-3 comment fs-5'>quick play</p>
                    <Button type='button' arrow className='w-100'
                    onClick={()=>continueAsGuest()}>Continue as Guest</Button>
                </div>

                <div style={{width:"min(350px,calc(100vw - 2rem)"}}>
                    <p className='m-0 mb-3 comment fs-5'>to save your progress</p>
                    <Button type='button' linkTo="register" linkState={{username}} arrow bordered className='w-100'>Register</Button>
                </div>
                
                {
                    stage===1 &&
                    
                    <div style={{marginTop:"1rem"}}>
                        <Button variant='danger' bordered onClick={()=>setStage(0)}>Back</Button>
                    </div>
                }
            </form>
        }
        </>
    );
}

export default EntryForm;