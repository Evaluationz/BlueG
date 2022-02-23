import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { Button,Container,Card,InputGroup,FormControl,Row,Col,Stack,Alert,Form,Modal } from 'react-bootstrap';
import Dashboard from "./views/dashboard";
import ReportDownload from "./views/reportDownload";


import './App.css';

import { Auth,Hub } from 'aws-amplify';

const initialFormState = {
  username:'',contactno:'',companyname:'', password:'', authCode:'',checkConfirm:false, formType:'singIn'
}


function App() {
  
  const [ formState, updateFormState ] = useState(initialFormState);
  const [ user, updateUser ] = useState(null);
  const [show, setShow] = useState(false);
  
  const [validated, setValidated] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    else{
      setShow(true);
    }
    setValidated(true);
  };

  useEffect(() => {
    checkUser()
    setAuthListener()
  },[])
  
  async function checkUser(){
    try{
      const user = await Auth.currentAuthenticatedUser()
      updateUser(user)
      updateFormState(() => ({...formState,formType:'confirmSingIn'}))
    }catch(err){
      updateUser(null)
    }
  }

  async function setAuthListener(){
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn':
            console.log('user signed in');
            break;
        case 'signOut':
            console.log('user signed out');
            break;
        case 'signIn_failure':
            console.log('user sign in failed');
            break;
        case 'configured':
            console.log('the Auth module is configured');
      }
    });
  }

  const { formType } = formState

  function onChange(e){
    console.log(e)
    e.persist();
    updateFormState(() => ({...formState,[e.target.name]:e.target.value}))
    console.log(e.target.name,'-----',e.target.value);
    if(e.target.name == 'password'){
      var paswd=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if(e.target.value.match(paswd)) 
        { 
          setPasswordValidity(false);
        }
        else{
          setPasswordValidity(true);
        }
    }
  }

  async function confirmContract(){
    try{
    setShow(false)
    console.log(formState)
    const { username,password,checkConfirm} = formState;
    console.log(checkConfirm,'Check')
    if(!checkConfirm){
      console.log('Check Box..!')
    }
    else {
      await Auth.signUp({ username,password })
      //Add Location Capture to Kompass
      updateFormState(() => ({...formState,formType:'confirmSignUp'}))
    }
    }
    catch(err){
      console.log('Got it..!',err)
     
    }
  }
  async function closeContract(){
    setShow(false)
  }
  async function confirmSignUp(){
    const { username,authCode} = formState;
    await Auth.confirmSignUp(username,authCode)
    updateFormState(() => ({...formState,formType:'singIn'}))
  }
  async function signIn(){
    const { username,password} = formState;
    await Auth.signIn(username,password)
    updateFormState(() => ({...formState,formType:'confirmSingIn'}))
  }
  
  return (
    <div className="App">
      {
        formType === 'signUp' && (
          <div>
          <Modal show={show} onHide={closeContract}>
          <Modal.Header closeButton>
          <Modal.Title>Service Agreement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Stack gap={4} className="mx-auto">  
          <InputGroup>
          <FormControl as="textarea" rows={12} disabled readOnly placeholder='abc abc'/>
          </InputGroup>
          <Form.Check type='checkbox'>
          <Form.Check.Input onChange={onChange} name='checkConfirm'/>
          <Form.Check.Label>I have read and agreed to the service agreement for Pre-Employment Screening Service</Form.Check.Label>
          </Form.Check>
          </Stack>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="success" onClick={confirmContract}>I Agree</Button>
          </Modal.Footer>
          </Modal>
            <Container fluid style={{ background: '#e6ebe7' }}>
             <Container className="d-flex justify-content-md-center align-items-center" style={{ height: '100vh' }}>
              <Row>
              <Col>
              <Card  border="light" className='shadow-lg rounded' style={{ width: '40rem' }}>
              <Row>
              <Col md="4" className="d-flex justify-content-md-center align-items-center" style={{ height: '50vh' }}>
              <Card.Img variant="top" src={ require('./blueg-logo.png')} style={{ height: '20vh',width:'20vh' }}/>
              </Col>
              <Col>
              <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <InputGroup className="mb-3">
              <FormControl name='username' required type='email' placeholder="Email address" onChange={onChange}/>
              </InputGroup>
              <InputGroup className="mb-3">
              <FormControl name='companyname' required type='text' placeholder="Company name" onChange={onChange}/>
              </InputGroup>
              <InputGroup className="mb-3">
              <FormControl name='contactno' required type='number' placeholder="Contact number" onChange={onChange}/>
              </InputGroup>
              <InputGroup className="mb-3">
              <FormControl isInvalid={passwordValidity} name='password' required type='password' placeholder="Password" onChange={onChange}/>
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
              </InputGroup>
              <Stack gap={4} className="mx-auto">
              <Button variant="primary" type="submit"> Sign Up</Button>
              </Stack>
              </Form>
              </Card.Body>
              </Col>
              </Row>
              </Card>
              </Col>
              </Row>
              </Container>
             </Container>
            </div>
        )
      }
       {
        formType === 'confirmSignUp' && (
          <div>
            <Container fluid className="d-flex justify-content-md-center align-items-center" style={{ height: '100vh' , background: '#e6ebe7' }}>
              <Row>
              <Col>
              <Card border="light" className='shadow-lg rounded' style={{ width: '25rem' }}>
              <Card.Body>
              <InputGroup className="mb-3">
              <FormControl name='authCode' type='number' placeholder="Confirmation code" onChange={onChange}/>
              </InputGroup>
              <Stack gap={4} className="mx-auto">
              <Button onClick={confirmSignUp} variant="primary" type="submit"> Confirm Sing-Up</Button>
              </Stack>
              </Card.Body>
              </Card>
              </Col>
              </Row>
             </Container>
          </div>
        )
      }
       {
        formType === 'singIn' && (
          <div>
            <Container fluid style={{ background: '#e6ebe7' }}>
             <Container className="d-flex justify-content-md-center align-items-center" style={{ height: '100vh' }}>
              <Row>
              <Col>
              <Card  border="light" className='shadow-lg rounded' style={{ width: '40rem' }}>
              <Row>
              <Col md="4" className="d-flex justify-content-md-center align-items-center" style={{ height: '50vh' }}>
              <Card.Img variant="top" src={ require('./blueg-logo.png')} style={{ height: '20vh',width:'20vh' }}/>
              </Col>
              <Col>
              <Card.Body>
              <InputGroup className="mb-3">
              <FormControl name='username' placeholder="Email address" onChange={onChange}/>
              </InputGroup>
              <InputGroup className="mb-3">
              <FormControl name='password' type='password' placeholder="Password" onChange={onChange}/>
              </InputGroup>
              <Stack gap={4} className="mx-auto">
              <Button onClick={signIn} variant="primary"> Sign In</Button>
              <hr class="mt-3 mb-3"></hr>
              <Button size="lg" type="submit" onClick={()=>updateFormState(() => ({...formState,formType:'signUp'}))} variant="dark">Create New Account</Button>
              </Stack>
             </Card.Body>
             </Col>
             </Row>
              </Card>
              </Col>
              </Row>
              </Container>
             </Container>
            </div>
        )
      }
       {
        formType === 'confirmSingIn' && (
          <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reportDownload" element={<ReportDownload />} />
         
        </Routes>
        )
      }
    </div>
  );
}


export default App;
