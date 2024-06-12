import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setUser } from '../Store/Auth/authSlice';
import { socket } from '../socketClient/socketClient';
import { generateAvatar } from '../Helpers/avatar';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

function EntryForm({}) {

    const [username,setUsername] = useState("");
    const [stage,setStage] = useState(0);

    const dispatch = useDispatch();

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
        setStage(1);
        // if(username!=="")
        // {
        //     const user = {
        //         userId: uuidv4(),
        //         username: username.trim(),
        //         avatar: generateAvatar()
        //     };

        //     dispatch(setUser(user));

        //     socket.emit("login",user);
        // }
    }

    return (
        <>
        {
            stage===0 ?
            <form className="entry-form-containter font-mono d-flex flex-column align-items-center gap-3 text-white" onSubmit={userEnter}>
                <input className='main-input fs-4 w-100' type="text" placeholder='<Enter your name>'
                value={username} onChange={handleUsername}/>
                <Button type='submit' className='main-button arrow w-100' disabled={!username}>Join</Button>
                <p className='m-0 mt-3 comment fs-5'>or if you've been here before</p>
                <div className="d-flex align-items-center gap-4 w-100">
                    <Button type='button' as={Link} to={"/login"} className='main-button arrow secondary w-100'>Log in</Button>
                    {/* <Button type='button' as={Link} to={"register"} className='main-button arrow w-100'>Register</Button> */}
                </div>
            </form>
            : stage===1 &&
            <form className="entry-form-containter font-mono d-flex flex-column align-items-center gap-3 text-white">
                <Button type='button' className='main-button arrow w-100'>Continue as Guest</Button>
                <p className='m-0 mt-3 comment fs-5'>or if you want to save your progress</p>
                <Button type='button' as={Link} to={"register"} state={{username}} className='main-button secondary arrow w-100'>Register</Button>
            </form>
        }
        </>
    );
}

export default EntryForm;