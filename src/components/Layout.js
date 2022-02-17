import { Button,Offcanvas,Navbar,Container,NavDropdown,Nav } from 'react-bootstrap';
// import React, { useState } from "react";
import { IconName } from "react-icons/fa";
import {FaHome} from "react-icons/fa"
import {GiNotebook} from "react-icons/gi"




function Layout() { 
    return (
      <>
       <Navbar style={{backgroundColor: 'rgb(49, 96, 224)'}} variant="dark" expand={false}>
        <Container fluid>
            <Navbar.Toggle aria-controls="offcanvasNavbar" />
            <Navbar.Brand href="#"><img src="../logo.png" width="100%" height="50" className="d-inline-block align-top"
                alt="logo"
            /></Navbar.Brand>
            <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            >
            <center>
            <Offcanvas.Header style={{color:'black'}}>
                <Offcanvas.Title id="offcanvasNavbarLabel"><img src="../bluegimage.png" width="100" height="100" className="d-inline-block align-top"
                alt="logo"
            />BlueG</Offcanvas.Title>
            </Offcanvas.Header></center>
            <Offcanvas.Body>
                <Nav className="justify-content-start flex-grow-1 pe-3">
                <Nav.Item >
                    <Nav.Link icon="chart-line" href="/dashboard" style={{color:'black',fontSize:"120%"}}> <FaHome/>  Dashboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/reportDownload" style={{color:'black',fontSize:"120%"}}> <GiNotebook />  Report Download</Nav.Link>
                </Nav.Item>
               
                {/* <NavDropdown title="Dropdown" id="offcanvasNavbarDropdown">
                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                    Something else here
                    </NavDropdown.Item>
                </NavDropdown> */}
                </Nav>
            </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
        </Navbar>
      </>
    );
  }

  export default Layout;