import React from 'react';
import { Button, Container, Dropdown, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { auth } from '../Firebase/firebase';
import { setUser } from '../Store/Auth/authSlice';
import UserAvatar from '../Components/UserAvatar';

function NavBar({}) {

    const user = useSelector(store => store.auth.user);

    const dispatch = useDispatch();

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
              <Dropdown className='d-flex flex-column align-items-center'>
                <Dropdown.Toggle className='main-bg p-0 rounded-0 d-flex gap-3 align-items-center pe-3 border-0 border-bottom border-white border-3' id="dropdown-basic">
                      <UserAvatar src={user.avatar} style={{height:42}}/>
                      <p className='m-0 fs-5'>{user.username}</p>
                </Dropdown.Toggle>

                <Dropdown.Menu className='p-0 rounded-0 text-center' style={{left:"unset"}}>
                  <Dropdown.Item className='p-2' as={Link} to={"/profile"}>Profile</Dropdown.Item>
                  
                  <Dropdown.Item className='p-0'>
                    <Button className='main-button w-100 danger arrow fs-6'
                    onClick={()=>{
                      dispatch(setUser(null));
                      auth.signOut();
                    }}
                    >Logout</Button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
          }
          </Nav>
        </Container>
    </Navbar>
    );
}

export default NavBar;