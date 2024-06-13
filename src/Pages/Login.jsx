import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { auth, googleProvider } from '../Firebase/firebase';
import { getUser } from '../Firebase/DataHandlers/users';
import { setUser } from '../Store/Auth/authSlice';
import { Button, Spinner } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Login({}) {
   
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading,setLoading] = useState(false);
    const [loginInfo,setLoginInfo] = useState({
        email:"",
        password: ""
    });

    function handleLoginInfo(e)
    {
        setLoginInfo(l => ({...l,[e.target.name]:e.target.value}));
    }
    
    async function handleSignIn(signInType)
    {
        let userCred;
        if(signInType==="google")
        {
            userCred = await signInWithPopup(auth, googleProvider);
        }
        else if(signInType==="email")
        {
            console.log(loginInfo.email,loginInfo.password);
            userCred = await signInWithEmailAndPassword(auth,loginInfo.email,loginInfo.password);
        }


        if(userCred?.user)
        {
            const loggedInUserInfo = await getUser(userCred.user.uid);
            
            if(loggedInUserInfo)
            {
                const user = {
                    userId: userCred.user.uid,
                    email: userCred.user.email,
                    ...loggedInUserInfo
                }
                dispatch(setUser(user));
                navigate("/");
            }
            else
            {
                console.log("missing username");
                navigate("/");
            }

        }
    }


  

    return (
        <div className='page-container d-flex flex-column align-items-center justify-content-center gap-2'>
        {
            loading ?
            <Spinner className='text-white' />
            :
            <>
                <form className='entry-form-container d-flex flex-column align-items-center shadow gap-3'
                onSubmit={(e)=>{
                    e.preventDefault();
                    handleSignIn("email");
                }}
                >
                    <input className='main-input fs-5 w-100' type="email" placeholder='<Enter Email>'
                    name='email' value={loginInfo.email} onChange={handleLoginInfo} />

                    <div className="d-flex align-items-center w-100 gap-3">
                        <input className='main-input fs-5 w-100' type="password" placeholder='<Enter Password>'
                        name='password' value={loginInfo.password} onChange={handleLoginInfo} />
                    </div>
                    <Button type='submit' className='main-button arrow w-100'>Log in</Button>
                </form>
                <p className='m-0 comment fs-5'>or</p>
                <div className='entry-form-container d-flex flex-column align-items-center shadow gap-3'>
                    <Button className='main-button secondary arrow w-100'
                    onClick={()=>handleSignIn("google")}
                    > Sign up with Google <FaGoogle /></Button>
                </div>
                <Button as={Link} to={"/"} className='main-button danger mt-5'>Back</Button>
            </>
        }
        </div>
    );
}

export default Login;