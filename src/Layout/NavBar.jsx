import React from 'react';
import { Button, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { auth } from '../Firebase/firebase';
import { setUser } from '../Store/Auth/authSlice';

function NavBar({}) {

    const user = useSelector(store => store.auth.user);
    const dispatch = useDispatch();

    console.log(user);

    return (
    <Navbar
    expand="lg"
    className="app-navbar position-absolute w-100 top-0 dark-bg text-white font-mono py-2">
        <Container>
          <Navbar.Brand as={Link} to={"/"}>
            <img src={require("../assets/logo.png")} style={{height:30}} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav className="">
          {
              user?.username &&
              <div className='d-flex gap-3'>
                <div className='main-bg d-flex gap-3 align-items-center pe-3 border-bottom border-white border-3'>
                    <img src={user.avatar} className='user-avatar' style={{height:42}}/>
                    <p className='m-0 fs-5'>{user.username}</p>
                </div>
                <Button className='main-button danger arrow'
                onClick={()=>{
                  dispatch(setUser(null));
                  auth.signOut()
                }}
                >Logout</Button>
              </div>
          }
          </Nav>
        </Container>
    </Navbar>
    );
}

export default NavBar;