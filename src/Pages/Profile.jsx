import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { generateAvatar, generateAvatarString } from '../Helpers/avatar';
import { update } from 'firebase/database';
import { removeUser, setUser, updateUser } from '../Store/Auth/authSlice';
import UserAvatar from '../Components/UserAvatar';
import { EmailAuthProvider, GoogleAuthProvider, deleteUser, getAuth, reauthenticateWithCredential, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../Firebase/firebase';

function Profile({}) {

    const user = useSelector(store => store.auth.user);
    const loading = useSelector(store => store.auth.loading);
    
    const [edit,setEdit] = useState(false);
    const [userEdit,setUserEdit] = useState();

    const [deleteModal,setDeleteModal] = useState(false);

    const [reloginWarning,setReloginWarning] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleUserEdit(e,value)
    {
        setUserEdit({...userEdit,[e.target.name]:value || e.target.value})
    }

    function discardChanges()
    {
        setUserEdit();
        setEdit(false);

    }
    
    function saveChanges()
    {
        dispatch(updateUser(userEdit));
        setEdit(false);
    }

    async function confirmDeleteAccount()
    {
        let error;
        try {
            await deleteUser(auth.currentUser);
        } catch (err) {
            error = err;
            // console.log(err.code);
        }

        
        if(error)
        {
            if(error.code==="auth/requires-recent-login")
            {
                setReloginWarning(true);
            }
        }
        else
        {
            dispatch(removeUser(user));
        }
    }

    useEffect(()=>{
        if(!user && !loading)
        {
            navigate("/");
        }
    },[user,loading]);

    return (
        <div className='page-container d-flex flex-column align-items-center justify-content-center'>
            <Container>
            {
                user &&
                <div className="d-flex flex-column align-items-center font-mono text-white gap-4">
                {
                    !edit ?
                    <div className="dark-bg w-100 d-flex flex-column p-3 gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <UserAvatar className='border border-5 border-white' src={user.avatar} style={{height:100}} />
                            <h2 className='m-0'>{user.username}</h2>
                        </div>
                        <div className="w-100 d-flex justify-content-end">
                            <Button className='main-button secondary' onClick={()=>{
                                setUserEdit({
                                    username: user?.username,
                                    avatar: user?.avatar
                                });
                                setEdit(true)
                            }}>Edit</Button>
                        </div>
                    </div>
                    :
                    <div className="dark-bg w-100 d-flex flex-column p-3 gap-3">
                        <div className="d-flex align-items-center gap-5">
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-center gap-2 fs-5">
                                    <span className='comment'>Color:</span>
                                    <Form.Control
                                        type="color"
                                        className='border-0 rounded-0 bg-transparent'
                                        value={"#"+userEdit.avatar.slice(0,6)}
                                        name="avatar"
                                        onChange={(e)=>{
                                            handleUserEdit(e,`${e.target.value.slice(1)}${userEdit.avatar.slice(6)}`)
                                        }}
                                    />
                                </div>
                                <Button className='main-button secondary arrow'
                                onClick={()=>{
                                    setUserEdit({...userEdit,avatar:generateAvatarString(userEdit.avatar.slice(0,6))});
                                }}
                                >Randomize Avatar</Button>
                            </div>
                            <UserAvatar className='border border-5 border-white' src={userEdit.avatar} style={{height:100}} />
                            <div className="d-flex flex-column fs-5 gap-3">
                                <span className='comment'>Username:</span>
                                <input type="text" className="main-input fs-3" name='username' value={userEdit.username} onChange={handleUserEdit} />
                            </div>
                        </div>
                        <div className="w-100 d-flex justify-content-end gap-3">
                            <Button className='main-button danger'
                            onClick={()=>discardChanges()}
                            >Discard</Button>

                            <Button className='main-button'
                            onClick={()=>saveChanges()}
                            >Save Changes</Button>
                        </div>
                    </div>
                }

                    <Button className='main-button arrow danger' onClick={()=>setDeleteModal(true)}>Delete Account</Button>
                </div>
            }
            </Container>

        <Modal show={deleteModal}
        contentClassName='dark-bg text-white font-mono rounded-0 border border-2 border-white'
        centered
        onHide={()=>setDeleteModal(false)}
        >
            <Modal.Body className='d-flex flex-column align-items-center p-4 gap-3 '>
            {
                reloginWarning ?
                <>
                    <h4 className='w-100 text-center'>Please Log out and Log in again to be able to Delete your account.</h4>
                    <Button className='main-button danger arrow' onClick={()=>{
                        dispatch(setUser(null));
                        auth.signOut();
                        navigate("/login");
                    }}>Log out</Button>
                </>
                :
                <>
                    <h4 className='w-100 text-center'>Are you SURE you want to delete this account?</h4>
                    <Button className='main-button danger arrow' onClick={()=>confirmDeleteAccount()}>Delete Account</Button>
                </>
            }
            </Modal.Body>
            <Modal.Footer className='border-0'>
            
            </Modal.Footer>
        </Modal>
        </div>
    );
}

export default Profile;