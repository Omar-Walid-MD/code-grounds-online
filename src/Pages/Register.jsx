import { createUserWithEmailAndPassword, getRedirectResult, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Button, Container, Spinner } from 'react-bootstrap';
import { auth, gitHubProvider, googleProvider } from '../Firebase/firebase';
import { getUser, registerUser } from '../Firebase/DataHandlers/users';
import { useLocation, useNavigate } from 'react-router';
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { setUser } from '../Store/Auth/authSlice';
import { Link } from 'react-router-dom';
import { generateAvatar, generateAvatarString } from '../Helpers/avatar';

function Register({}) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const username = useLocation().state?.username;
    const [loading,setLoading] = useState(false);
    const [loginInfo,setLoginInfo] = useState({
        email:"",
        password: "",
        confirmPassword: ""
    });

    function handleLoginInfo(e)
    {
        setLoginInfo(l => ({...l,[e.target.name]:e.target.value}));
    }
    
    async function handleSignUp(signUpType)
    {
        let userCred;
        if(signUpType==="google")
        {
            userCred = await signInWithPopup(auth, googleProvider);
        }
        else if(signUpType==="email")
        {
            userCred = await createUserWithEmailAndPassword(auth,loginInfo.email,loginInfo.password);
        }
        if(userCred?.user)
        {
            const userAlreadyExists = await getUser(userCred.user.uid);
            console.log(userAlreadyExists);
            
            if(!userAlreadyExists)
            {

                const avatarString = generateAvatarString();

                registerUser(userCred.user.uid,{
                    username: username,
                    avatar: avatarString
                });
    
                const user = {
                    userId: userCred.user.uid,
                    email: userCred.user.email,
                    username: username,
                    avatar: generateAvatar(avatarString)
                }
                dispatch(setUser(user));
            }
            else
            {
                const user = {
                    userId: userCred.user.uid,
                    email: userCred.user.email,
                    ...userAlreadyExists
                }
                dispatch(setUser(user));
            }

            navigate("/");
        }
    }


  

    return (
        <div className='page-container d-flex flex-column align-items-center justify-content-center gap-2'>
        {
            loading ?
            <Spinner className='text-white' />
            :
            <>
                {
                    username &&   
                    <div className="p comment fs-5 mb-3">Registering as "<span className='text-white'>{username}</span>"</div>
                }
                <form className='auth-form-container d-flex flex-column align-items-center shadow gap-3'
                onSubmit={(e)=>{
                    e.preventDefault();
                    handleSignUp("email");
                }}
                >
                    <input className='main-input fs-5 w-100' type="email" placeholder='<Enter Email>'
                    name='email' value={loginInfo.email} onChange={handleLoginInfo} />

                    <div className="d-flex align-items-center w-100 gap-3">
                        <input className='main-input fs-5 w-100' type="password" placeholder='<Enter Password>' autoComplete="new-password"
                        name='password' value={loginInfo.password} onChange={handleLoginInfo} />
                        <input className='main-input fs-5 w-100' type="password" placeholder='<Confirm Password>' autoComplete="new-password" />
                    </div>
                    <Button type='submit' className='main-button arrow w-100'>Register</Button>
                </form>
                <p className='m-0 comment fs-5'>or</p>
                <div className='auth-form-container d-flex flex-column align-items-center shadow gap-3'>
                    <Button className='main-button secondary arrow w-100'
                    onClick={()=>handleSignUp("google")}
                    > Sign up with Google <FaGoogle /></Button>
                </div>
            </>
        }
        <Button as={Link} to={"/"} className='main-button danger mt-5'>Back</Button>
        </div>
    );
}

export default Register;