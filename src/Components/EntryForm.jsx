import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setUser } from '../Store/Auth/authSlice';
import { socket } from '../socketClient/socketClient';
import { generateAvatar } from '../Helpers/avatar';
import { v4 as uuidv4 } from 'uuid';

function EntryForm({}) {

    const [username,setUsername] = useState("");


    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        if(username!=="")
        {
            const user = {
                userId: uuidv4(),
                username: username.trim(),
                avatar: generateAvatar()
            };

            dispatch(setUser(user));

            socket.emit("login",user);

            // navigate("/play");
        }
    }

    return (
        <form className="entry-form-containter d-flex flex-column align-items-center gap-3 text-white" onSubmit={userEnter}>
            <input className='main-input fs-4 w-100' type="text" placeholder='<Enter your name>'
            value={username} onChange={handleUsername}/>
            <Button type='submit' className='main-button arrow w-100' disabled={!username}>Join</Button>
        </form>
    );
}

export default EntryForm;