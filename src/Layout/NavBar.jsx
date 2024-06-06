import React from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function NavBar({}) {

    const user = useSelector(store => store.auth.user);


    return (
    <Navbar
    expand="lg"
    className="app-navbar position-absolute w-100 top-0 dark-bg text-white font-mono py-2">
        <Container>
          <Navbar.Brand as={Link} to={"/"}>
            <img src={require("../assets/logo.png")} style={{height:30}} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className=' justify-content-end' id="basic-navbar-nav">
            <Nav className="">
            {
                user &&
                <div className='main-bg d-flex gap-3 align-items-center pe-3 border-bottom border-white border-3'>
                    <img src={user.avatar} className='user-avatar' style={{height:30}}/>
                    <p className='m-0 fs-5'>{user.username}</p>
                </div>
            }
            </Nav>
          </Navbar.Collapse>
        </Container>
    </Navbar>
    );
}

export default NavBar;