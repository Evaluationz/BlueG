import { Button, Offcanvas, Navbar, Container, Nav } from 'react-bootstrap';

// import React, { useState } from "react";
// import { IconName } from "react-icons/fa";
// import { FaHome } from "react-icons/fa"
// import { GiNotebook } from "react-icons/gi"
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import configData from "../config/index.json"
import axios from "axios";

import {
    Modal
} from "react-bootstrap";

import { Auth } from 'aws-amplify';

function Layout() {
    const [BasicModalShow, setShowModal] = useState(false);
    const [clientName, updateClientName] = useState('');

    const handleCloseModal = () => setShowModal(false);
    //const handleShowCompanyInfo = () => setShowCompanyInfo(true);

    useEffect(() => {
        loadData()
    }, []);

    async function loadData() {
        const user = await Auth.currentAuthenticatedUser()
        if (user) {
            let url = configData.express_url
            var postData = { client_id: user.attributes.email }
            let clientDetails = await axios.post(url + "client/getClientId", postData)
            let client_name = clientDetails.data.client_name;
            updateClientName(client_name)
        }
    }

    function LogOut() {
        setShowModal(true)
    }
    async function signOut() {
        await Auth.signOut();
        window.location.href = '/'
    }
    function Cancel() {
        setShowModal(false)
    }

    return (
        <>
            <Modal show={BasicModalShow} onHide={handleCloseModal}>
                <Modal.Body>
                    <Modal.Title className="f-50 text-center">
                        <i className="mdi mdi-alert-circle-outline c-blue"> </i>
                    </Modal.Title>
                    <Modal.Title className="f-18 text-center">Are you sure want to Logout?</Modal.Title>
                    <div className="col-lg-12 d-flex align-items-center justify-content-center mt-2">
                        <Button className='btn-white' onClick={Cancel}>NO</Button>
                        <Button className='btn-blue ml-3' onClick={signOut} >YES</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Navbar collapseOnSelect variant="dark" expand={true} fixed="top" className="bg-black shadow-sm">
                <Container fluid className="mx-lg-5">
                    <Navbar.Brand className="d-flex">
                        <Link className="navbar-brand mr-0"
                            to="/" onClick={() => { window.location.href = "/" }}>
                            <div className="d-flex align-items-center justify-content-start">
                                <img src="./images/logo.png" alt="logo" className="logo logo-image" />
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
                                    <span>{clientName}</span>
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
