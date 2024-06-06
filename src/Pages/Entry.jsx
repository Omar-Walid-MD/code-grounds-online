import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { setUser } from '../Store/Auth/authSlice';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { socket } from '../socketClient/socketClient';
// import { generateAvatar } from '../Helpers/avatar';

function Entry({}) {

    const [username,setUsername] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(store => store.auth.user);

    function userEnter(e)
    {
        e.preventDefault();
        if(username!=="")
        {
            const user = {
                userId: uuidv4(),
                username,
                avatar: null//generateAvatar()
            };

            dispatch(setUser(user));

            socket.emit("login",user);

            navigate("/play");
        }
    }

    useEffect(()=>{
        if(user) navigate("play");
    },[user])

    return (
        <div className='page-container d-flex flex-column align-items-center justify-content-center'>
            <form className="d-flex flex-column align-items-center gap-3 text-white" onSubmit={userEnter}>
                <input className='main-input fs-4' type="text" placeholder='<Enter your name>'
                value={username} onChange={(e)=>setUsername(e.target.value)}
                style={{width:500}} />
                <Button type='submit' className='main-button arrow w-100' disabled={!username}>Join</Button>
            </form>
        </div>
    );
}

export default Entry;