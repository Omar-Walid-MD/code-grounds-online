import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { auth, googleProvider } from '../Firebase/firebase';
import { getUser } from '../Firebase/DataHandlers/users';
import { setUser } from '../Store/Auth/authSlice';
import { Spinner } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '../Components/Button';

function Login({}) {
   
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading,setLoading] = useState(false);
    const [loginInfo,setLoginInfo] = useState({
        email:"",
        password: ""
    });

    const [errorMessage,setErrorMessage] = useState("");

    function handleLoginInfo(e)
    {
        setLoginInfo(l => ({...l,[e.target.name]:e.target.value}));
    }
    
    async function handleSignIn(signInType)
    {
        let userCred;
        if(signInType==="google")
        {
            try {
                userCred = await signInWithPopup(auth, googleProvider);
            } catch (error) {

            }
        }
        else if(signInType==="email")
        {
            try {  
                userCred = await signInWithEmailAndPassword(auth,loginInfo.email,loginInfo.password);
            } catch (error) {

                if(error.code==="auth/invalid-credential")
                {
                    setErrorMessage("!Email.isCorrect || !Password.isCorrect")
                }
                return
            }
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
                navigate("/");
            }

        }
    }


    return (
        <div className='page-container main-bg px-3 font-mono d-flex flex-column align-items-center justify-content-center gap-2'>
        {
            loading ?
            <Spinner className='text-white' />
            :
            <>
                <form className='entry-form-container d-flex flex-column align-items-center gap-3'
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
                    {errorMessage && <p className='m-0 px-2 bg-danger text-white shadow'>{errorMessage}</p>}
                    <Button type='submit' className='w-100' arrow disabled={!(loginInfo.email && loginInfo.password)} >Log in</Button>
                </form>
                <p className='m-0 comment fs-5'>or</p>
                <div className='entry-form-container d-flex flex-column align-items-center gap-3'>
                    <Button className='w-100'
                    arrow
                    bordered
                    onClick={()=>handleSignIn("google")}
                    >Sign in with Google <FaGoogle /></Button>
                </div>
                <Button variant='danger' linkTo="/" bordered className='mt-5'>Back</Button>
            </>
        }
        </div>
    );
}

export default Login;