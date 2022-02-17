import { Button,Offcanvas,Navbar,Container,NavDropdown,Nav } from 'react-bootstrap';

// import React, { useState } from "react";
import { Auth } from 'aws-amplify';

function Layout() { 
    async function signOut(){
        await Auth.signOut();
        window.location.reload(false);
      }
    return (
      <>
       <Navbar bg="primary" variant="dark" expand={false}>
        <Container fluid>
            <Navbar.Toggle aria-controls="offcanvasNavbar" />
            <Navbar.Brand href="#"><img src={require("../logo.svg").default} width="30" height="30" className="d-inline-block align-top"
                alt="logo"
            />Blue G</Navbar.Brand>
            <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            >
            <Offcanvas.Header>
                <Offcanvas.Title id="offcanvasNavbarLabel">Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav className="justify-content-start flex-grow-1 pe-3">
                <Nav.Item>
                    <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/reportDownload">Report Download</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <button onClick={signOut}>Sign Out</button>
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