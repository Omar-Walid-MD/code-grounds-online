import { getRedirectResult, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Button, Container, Spinner } from 'react-bootstrap';
import { auth, googleProvider } from '../Firebase/firebase';
import { registerUser } from '../Firebase/DataHandlers/users';
import { useNavigate } from 'react-router';

function Register({}) {

    const navigate = useNavigate();

    const [username,setUsername] = useState("");
    const [loggedIn,setLoggedIn] = useState(false);
    const [loading,setLoading] = useState(false);
    const [user,setUser] = useState(true);


    function handleUsername(e)
    {
        if(e.target.value.length <= 20)
        {
            setUsername(e.target.value);
        }
    }

    function userEnter(e)
    {
        e.preventDefault();
        console.log("done");
        registerUser(user.uid,username);
        navigate("/");
    }

    async function handleGoogleSignIn()
    {
        const userCred = await signInWithPopup(auth, googleProvider);
        if(userCred?.user)
        {
            console.log(userCred.user);
            setUser(userCred.user);
            setLoggedIn(true);
            setUsername(userCred.user.displayName);
        }
    }


  

    return (
        <div className='page-container d-flex flex-column align-items-center justify-content-center gap-2'>
        {
            loading ?
            <Spinner className='text-white' />
            :
            loggedIn ?
            <form className="entry-form-containter d-flex flex-column align-items-center gap-3 text-white" onSubmit={userEnter}>
                <input className='main-input fs-4 w-100' type="text" placeholder='<Enter your name>'
                value={username} onChange={handleUsername}/>
                <Button type='submit' className='main-button arrow w-100' disabled={!username}>Continue</Button>
            </form>
            :
            <>
                <form className='auth-form-container d-flex flex-column align-items-center p-3 dark-bg shadow gap-3'>
                    <input className='main-input fs-5 w-100' type="email" placeholder='<Enter Email>' />
                    <input className='main-input fs-5 w-100' type="text" placeholder='<Enter Username>' />
                    <div className="d-flex align-items-center w-100 gap-3">
                        <input className='main-input fs-5 w-100' type="password" placeholder='<Enter Password>' />
                        <input className='main-input fs-5 w-100' type="password" placeholder='<Confirm Password>' />
                    </div>
                    <Button type='submit' className='main-button arrow w-100'>Register</Button>
                </form>
                <p className='m-0 comment fs-5'>or</p>
                <div className='auth-form-container d-flex flex-column align-items-center p-3 dark-bg shadow gap-3'>
                    <Button className='main-button secondary arrow w-100'
                    onClick={handleGoogleSignIn}
                    >Sign in with Google</Button>
                </div>
            </>
        }
        </div>
    );
}

export default Register;