import { Button,Offcanvas,Navbar,Container,NavDropdown,Nav } from 'react-bootstrap';

// import React, { useState } from "react";
import { IconName } from "react-icons/fa";
import {FaHome} from "react-icons/fa"
import {GiNotebook} from "react-icons/gi"
import React, { Component } from "react";




import { Auth } from 'aws-amplify';

function Layout() {
    async function signOut(){
        await Auth.signOut();
        window.location.reload(false);
    }

    return (
        <>
            <Navbar className="shadow-sm bg-white" variant="dark" expand={false}>
                <Container fluid>
                    <div className="col-4 d-flex align-items-center justify-content-start">
                        <div className="d-flex align-items-center justify-content-center">
                            <img src="./images/logo.png"
                                 width="30"
                                 className="" alt="logo"/> <p className="mb-0 m-lg-1 logo-text">BlueG</p>
                        </div>
                        <Navbar.Toggle aria-controls="offcanvasNavbar"></Navbar.Toggle>
                    </div>

                    <div className="col-8 d-flex align-items-center justify-content-end">
                        <Navbar.Brand href="#" className="d-flex align-items-center justify-content-center m-0">
                            <img src="./images/user.png"
                                 width="40"
                                 className="d-inline-block align-top" alt="logo"/>
                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                className="user-dropdown"
                                menuVariant="dark">
                                <NavDropdown.Item href="#action/3.1"><i className="mdi mdi-account"></i> My Profile</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2"><i className="mdi mdi-cog"></i> Settings</NavDropdown.Item>
                                <NavDropdown.Item onClick={signOut}><i className="mdi mdi-logout"></i> Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Navbar.Brand>
                    </div>

                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="start">
                        <center>
                            <Offcanvas.Header style={{color:'black'}}>
                                <Offcanvas.Title id="offcanvasNavbarLabel" className="d-flex align-items-center justify-content-center">
                                    <img src="./images/user.png"
                                         width="40"
                                         className="d-inline-block align-top" alt="logo"/>
                                    <span>Kompass +</span>
                                </Offcanvas.Title>
                            </Offcanvas.Header></center>
                        <Offcanvas.Body>
                            <Nav className="justify-content-start flex-grow-1">
                                <Nav.Item>
                                    <Nav.Link href="/dashboard">
                                        <i className="mdi mdi-home"/> Dashboard
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="/reportDownload">
                                        <i className="mdi mdi-file-document-multiple-outline"/> Reports
                                    </Nav.Link>
                                </Nav.Item>

                                <Nav.Item>
                                    <Nav.Link onClick={signOut}>
                                        <i className="mdi mdi-logout"/> Logout
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
}

export default Layout;
