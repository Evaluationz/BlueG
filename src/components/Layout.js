import { Button, Offcanvas, Navbar, Container, NavDropdown, Nav } from 'react-bootstrap';

// import React, { useState } from "react";
import { IconName } from "react-icons/fa";
import { FaHome } from "react-icons/fa"
import { GiNotebook } from "react-icons/gi"
import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
    Modal
} from "react-bootstrap";




import { Auth } from 'aws-amplify';


function Layout() {

    const [BasicModalShow, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    //const handleShowCompanyInfo = () => setShowCompanyInfo(true);

    function LogOut() {
        setShowModal(true)
    }
    async function signOut() {
        await Auth.signOut();
        window.location.reload(false);
    }
    function Cancel() {
        setShowModal(false)
    }

    return (
        <>
            <Modal show={BasicModalShow} onHide={handleCloseModal}>
                
                <Modal.Body>
                <Modal.Title className="f-20">Are you sure want to logout</Modal.Title>
                    <div className="col-lg-12 py-3">
                        <Button className='btn-red float-left' onClick={Cancel}>cancel</Button>
                        <Button className='btn-blue float-right' onClick={signOut} >Ok</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Navbar collapseOnSelect variant="dark" expand={true} fixed="top" className="bg-black shadow-sm">
                <Container fluid className="mx-lg-5">
                    <Navbar.Brand className="d-flex">
                        <Link className="navbar-brand mr-0"
                            to="/" onClick={() => { window.location.href = "/" }}>
                            <div className="d-flex align-items-center justify-content-start">
                                <img src="images/logo.png" alt="logo" className="logo logo-image" />
                            </div>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="/dashboard" className="text-uppercase">Dashboard</Nav.Link>
                            <Nav.Link href="/reportDownload" className="text-uppercase">Reports</Nav.Link>
                            <Nav.Link href="/profile" className="text-uppercase">Profile</Nav.Link>
                            <Nav.Link onClick={LogOut} className="text-uppercase nav-btn"><i className="mdi mdi-logout" /> Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>

                    <Navbar.Toggle aria-controls="offcanvasNavbar" className="sidebar-toggle"></Navbar.Toggle>

                    <Navbar.Offcanvas id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="start">
                        <center>
                            <Offcanvas.Header style={{ color: 'black' }}>
                                <Offcanvas.Title id="offcanvasNavbarLabel" className="d-flex align-items-center justify-content-center">
                                    <img src="./images/user.png"
                                        width="40"
                                        className="d-inline-block align-top" alt="logo" />
                                    <span>Kompass +</span>
                                </Offcanvas.Title>
                            </Offcanvas.Header></center>
                        <Offcanvas.Body>
                            <Nav className="justify-content-start flex-grow-1">
                                <Nav.Item>
                                    <Nav.Link href="/dashboard">
                                        <i className="mdi mdi-home" /> Dashboard
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="/profile">
                                        <i className="mdi mdi-account" /> Profile
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="/reportDownload">
                                        <i className="mdi mdi-file-document-multiple-outline" /> Reports
                                    </Nav.Link>
                                </Nav.Item>

                                <Nav.Item>
                                    <Nav.Link onClick={LogOut}>
                                        <i className="mdi mdi-logout" /> Logout
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
