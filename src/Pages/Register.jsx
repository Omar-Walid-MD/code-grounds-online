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
    const [registerInfo,setRegisterInfo] = useState({
        email:"",
        password: "",
        confirmPassword: ""
    });

    const [errorMessage,setErrorMessage] = useState("");

    function handleRegisterInfo(e)
    {
        setRegisterInfo(l => ({...l,[e.target.name]:e.target.value}));
    }

    console.log(registerInfo);
    
    async function handleSignUp(signUpType)
    {
        let userCred;
        if(signUpType==="google")
        {
            userCred = await signInWithPopup(auth, googleProvider);
        }
        else if(signUpType==="email")
        {
            try {
                userCred = await createUserWithEmailAndPassword(auth,registerInfo.email,registerInfo.password);
                
            } catch (error) {
                if(error.code==="auth/weak-password")
                {
                    setErrorMessage("Password.length < 6")
                }
                return
            }
        }
        if(userCred?.user)
        {
            const userAlreadyExists = await getUser(userCred.user.uid);
            
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
        <div className='page-container font-mono d-flex flex-column align-items-center justify-content-center gap-2'>
        {
            loading ?
            <Spinner className='text-white' />
            :
            <>
                {
                    username &&   
                    <div className="p comment fs-5 mb-3">Registering as "<span className='text-white'>{username}</span>"</div>
                }
                <form className='auth-form-container d-flex flex-column align-items-center gap-3'
                onSubmit={(e)=>{
                    e.preventDefault();
                    handleSignUp("email");
                }}
                >
                    <input className='main-input fs-5 w-100' type="email" placeholder='<Enter Email>'
                    name='email' value={registerInfo.email} onChange={handleRegisterInfo} />

                    <div className="d-flex align-items-center w-100 gap-3">
                        <input className='main-input fs-5 w-100' type="password" placeholder='<Enter Password>' autoComplete="new-password"
                        name='password' value={registerInfo.password} onChange={handleRegisterInfo} />
                        <input className='main-input fs-5 w-100' type="password" placeholder='<Confirm Password>' autoComplete="new-password"
                        name='confirmPassword' value={registerInfo.confirmPassword} onChange={handleRegisterInfo} />
                    </div>
                    
                    {errorMessage && <p className='m-0 px-2 danger-bg text-white shadow'>{errorMessage}</p>}
                    <Button type='submit' className='main-button arrow w-100'
                    disabled={!(registerInfo.email && registerInfo.password && registerInfo.confirmPassword)}
                    >Register</Button>
                </form>
                <p className='m-0 comment fs-5'>or</p>
                <div className='auth-form-container d-flex flex-column align-items-center gap-3'>
                    <Button className='main-button secondary arrow w-100'
                    onClick={()=>handleSignUp("google")}
                    >Sign up with Google <FaGoogle /></Button>
                </div>
            </>
        }
        <Button as={Link} to={"/"} className='main-button danger mt-5'>Back</Button>
        </div>
    );
}

export default Register;