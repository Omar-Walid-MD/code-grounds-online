import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { generateAvatar, generateAvatarString } from '../Helpers/avatar';
import { update } from 'firebase/database';
import { updateUser } from '../Store/Auth/authSlice';

function Profile({}) {

    const user = useSelector(store => store.auth.user);
    const loading = useSelector(store => store.auth.loading);
    const [avatar,setAvatar] = useState();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    function saveChanges()
    {
        dispatch(updateUser({avatar}));

    }

    useEffect(()=>{
        if(!user && !loading)
        {
            navigate("/");
        }
    },[]);

    return (
        <div className='page-container d-flex flex-column align-items-center justify-content-center'>
            <Container>
            {
                user &&
                <div className="d-flex flex-column align-items-center font-mono text-white gap-3">
                    <h1 className='mb-4'>{user.username}</h1>
                    <img className='user-avatar border border-5 border-white' src={avatar ? generateAvatar(avatar) : user.avatar} style={{height:215}} />
                    <Button className='main-button secondary arrow'
                    onClick={()=>{
                        setAvatar(generateAvatarString());
                    }}
                    >Randomize Avatar</Button>

                    <Button className='main-button arrow mt-5'
                    onClick={()=>saveChanges()}
                    >Save Changes</Button>
                </div>
            }
            </Container>
        </div>
    );
}

export default Profile;