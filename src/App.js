import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import { Button,Container,Card,InputGroup,FormControl,Row,Col,Stack,Alert,Form,Modal } from 'react-bootstrap';
import Dashboard from "./views/dashboard";
import ReportDownload from "./views/reportDownload";
import Profile from "./views/Profile";
import Contract from "./components/Contract"
import configData from "./config/index.json"


import './App.css';

import { Auth,Hub } from 'aws-amplify';

const initialFormState = {
  username:'',cin:'',address: '',contactno:'',companyname:'',postion_coords:'', password:'', authCode:'',checkConfirm:false, formType:'singIn'
}

const alertSettings = {
  variant:'' , msg:'' , alertStatus: false
}

function App() {
  const [ alertState, updateAlertState ] = useState(alertSettings);
  const [ formState, updateFormState ] = useState(initialFormState);
  const [ user, updateUser ] = useState(null);
  const [ clientid, updateClientId ] = useState(null);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validatesignIn, setValidatedSignIn] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState(false);

  const signUp = (event) => {
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
  
  async function addressAuto(){
    let autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById( 'address' ),
      { types: [ 'geocode' ] }
    );
    autocomplete.addListener( 'place_changed', () =>{
      let place = autocomplete.getPlace()
      updateFormState(() => ({...formState,address:place.formatted_address}))
    });
  }

  async function checkUser(){
    try{
      const user = await Auth.currentAuthenticatedUser()
      if(user)
      {
      let url = configData.express_url
      var postData = {email: user.attributes.email}
      let clientDetails = await axios.post(url+"client/getClientId",postData)
      let kompass_id =clientDetails.data.client_id
      if(kompass_id !== "undifined" && kompass_id!==''){
        updateClientId(kompass_id)
      }

      updateUser(user)
      updateFormState(() => ({...formState,formType:'confirmSingIn'}))
    }
    }catch(err){
      updateUser(null)
    }
  }

  const { alertStatus,variant,msg } = alertState

  async function setAuthListener(){
    var msg='';
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn_failure':
            msg = data.payload.data.message
            updateAlertState(() => ({...alertState,alertStatus:true,variant:'danger' , msg:msg}))
            setValidatedSignIn(false);
            break;
        case 'configured':
            msg = data.payload.data.message
            updateAlertState(() => ({...alertState,alertStatus:true,variant:'success' , msg:msg}))
        }
    });
  }

  const { formType } = formState

  async function createAccount(){
    updateFormState(() => ({...formState,formType:'signUp'}))
    updateAlertState(() => ({...alertState,alertStatus:false}))
    setPasswordValidity(false);
  }

  function onChange(e){
    e.persist();
    updateAlertState(() => ({...alertState,alertStatus:false}))
    updateFormState(() => ({...formState,[e.target.name]:e.target.value}))
    if(e.target.name === 'password'){
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
    setShow(false)
    const { username,password,checkConfirm} = formState;
    if(!checkConfirm){
      var msg = 'Please accept the agreement to create the account.'
      updateAlertState(() => ({...alertState,alertStatus:true,variant:'danger' , msg:msg}))
    }
    else {
      //Add Data Captured to Kompass
      navigator.geolocation.getCurrentPosition(
       async position => {
          const { latitude, longitude } = position.coords;
          var postion_coords= 'Lat: '+latitude+' Long: '+longitude;
          const { companyname,cin,contactno,address } = formState;
          let url = configData.express_url
          var postData = {'client_name':companyname,'cin':cin,'email':username,'contact_no':contactno,'address':address,'postions':postion_coords}
          let updateClient = await axios.post(url+"client/createMClient",postData)
          if(updateClient.data === 'success'){
            try{
              await Auth.signUp({ username,password })
              updateFormState(() => ({...formState,formType:'confirmSignUp'}))
            }
            catch(err){
              msg = 'An account with the given email already exists.'
              updateAlertState(() => ({...alertState,alertStatus:true,variant:'danger' , msg:msg}))
            }
          }
          else {
                var msg = 'Unable to create account.Please try again'
                updateAlertState(() => ({...alertState,alertStatus:true,variant:'danger' , msg:msg}))
             }
        })
      
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
  async function signIn(event){
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    else{
      const { username,password} = formState;
      await Auth.signIn(username,password)
      updateFormState(() => ({...formState,formType:'confirmSingIn'}))
    }
    setValidatedSignIn(true);
  }

  async function resetPassword(){
    const { username,authCode,password} = formState;
    Auth.forgotPasswordSubmit(username, authCode ,password)
    .then(data => {
      updateFormState(() => ({...formState,formType:'singIn'}))
      var msg = 'Password Reset Success'
      updateAlertState(() => ({...alertState,alertStatus:true,variant:'success' , msg:msg}))
    
    })
    .catch(err => {
      var msg = 'Invalid code please request code again'
      updateAlertState(() => ({...alertState,alertStatus:true,variant:'success' , msg:msg}))
    });
  }

  async function forgotPassword(){
    const { username } = formState;
    Auth.forgotPassword(username)
    .then(data => {
      updateFormState(() => ({...formState,formType:'newPassword'}))
      var msg = 'Verification code sent to email'
      updateAlertState(() => ({...alertState,alertStatus:true,variant:'success' , msg:msg}))
    })
    .catch(err => {
      console.log(err)
      var msg = 'Plase enter email id'
      updateAlertState(() => ({...alertState,alertStatus:true,variant:'danger' , msg:msg}))
    });
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
                    <Contract formState={formState}/>
                  </InputGroup>
                  <Form.Check type='checkbox'>
                    <Form.Check.Input onChange={onChange} name='checkConfirm'/>
                    <Form.Check.Label style={{ fontSize:13 }}>I have read and agreed to the service agreement for Pre-Employment Screening Service</Form.Check.Label>
                  </Form.Check>
                </Stack>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={confirmContract}>I Agree</Button>
              </Modal.Footer>
            </Modal>

            <Container fluid className="bg-block">
              <Container className="d-flex justify-content-md-center align-items-center login-card-block my-5">
                <Row>
                  <Col>
                    <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                    <Card  border="light" className='shadow rounded login-card'>
                      <Row>
                        <Col>
                          <Card.Body className="d-flex align-items-center justify-content-start">
                            <Card.Img variant="top" src={ require('./logo.png')} style={{ width:'50px' }}/>
                            <span className="" style={{marginLeft: '0.5rem', fontWeight: '700'}}>BLUE G</span>
                          </Card.Body>
                          <Card.Body className="d-flex align-items-center justify-content-start py-0">
                            <h4 className="mb-0" style={{fontWeight: '700'}}>SIGN UP</h4>
                          </Card.Body>
                          <Card.Body>
                            <Form noValidate validated={validatesignIn} onSubmit={signUp}>
                              <Form.Group className="mb-3">
                                <Form.Label className="mb-0">Email</Form.Label>
                                <FormControl name='username' required type='email' placeholder="Email address" onChange={onChange}/>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="mb-0">Company name</Form.Label>
                                <FormControl name='companyname' required type='text' placeholder="Company name" onChange={onChange}/>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="mb-0">CIN</Form.Label>
                                <FormControl name='cin' required type='text' placeholder="CIN" onChange={onChange}/>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="mb-0">Address</Form.Label>
                                <FormControl name='address' id='address' required type='text' placeholder="Address" onFocus={addressAuto} onChange={onChange}/>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="mb-0">Contact number</Form.Label>
                                <FormControl name='contactno' required maxlength="10" type='number' placeholder="Contact number" onChange={onChange}/>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="mb-0">Password</Form.Label>
                                <FormControl isInvalid={passwordValidity} name='password' required type='password' placeholder="Password" onChange={onChange}/>
                                <Form.Control.Feedback type="invalid">
                                  password between 7 to 15 characters which contain at least one numeric digit and a special character
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Stack gap={3} className="mx-auto">
                                <Button variant="primary" type='submit'> Sign Up</Button>

                                <p className="decorated"><span>OR</span></p>

                                <Button variant="dark"><i className="mdi mdi-chevron-left"></i> Back to Sign In</Button>
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
            <Container fluid className="bg-block">
              <Container className="d-flex justify-content-md-center align-items-center login-card-block">
                <Row>
                  <Col>
                    <Card border="light" className='shadow rounded login-card'>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Label className="mb-0">Confirmation code</Form.Label>
                          <FormControl name='authCode' type='number' placeholder="Confirmation code" onChange={onChange}/>
                        </Form.Group>

                        <Stack gap={3} className="mx-auto">
                          <Button variant="primary" type="submit" onClick={confirmSignUp}> Confirm Sign-Up</Button>
                        </Stack>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </Container>
          </div>
      )
    }
    {
      formType === 'newPassword' && (
          <div>
            <Container fluid className="bg-block">
              <Container className="d-flex justify-content-md-center align-items-center login-card-block">
                <Row>
                  <Col>
                    <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                    <Card border="light" className='shadow rounded login-card'>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Label className="mb-0">Confirmation code</Form.Label>
                          <FormControl name='authCode' type='number' placeholder="Confirmation code" onChange={onChange}/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="mb-0">Password</Form.Label>
                          <FormControl isInvalid={passwordValidity} name='password' required type='password' placeholder="Password" onChange={onChange}/>
                          <Form.Control.Feedback type="invalid">
                            password between 7 to 15 characters which contain at least one numeric digit and a special character
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Stack gap={3} className="mx-auto">
                          <Button variant="primary" type="submit" onClick={resetPassword} >Reset Password</Button>
                          <Button variant="link" size="sm" onClick={forgotPassword}>Request code again</Button>
                        </Stack>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </Container>
          </div>
      )
    }
    {
      formType === 'singIn' && (
          <div>
            <Container fluid className="bg-block">
              <Container className="d-flex justify-content-md-center align-items-center login-card-block">
                <Row>
                  <Col>
                    <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                    <Card  border="light" className='shadow rounded login-card'>
                      <Row>
                        <Col>
                          <Card.Body className="d-flex align-items-center justify-content-start">
                            <Card.Img variant="top" src={ require('./logo.png')} style={{ width:'50px' }}/>
                            <span className="" style={{marginLeft: '0.5rem', fontWeight: '700'}}>BLUE G</span>
                          </Card.Body>
                          <Card.Body className="d-flex align-items-center justify-content-start py-0">
                            <h4 className="mb-0" style={{fontWeight: '700'}}>SIGN IN</h4>
                          </Card.Body>
                          <Card.Body>
                            <Form noValidate validated={validatesignIn} onSubmit={signIn}>
                              <Form.Group className="mb-3">
                                <Form.Label className="mb-0">Email</Form.Label>
                                <FormControl name='username' type='email' required onChange={onChange}/>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="mb-0">Password</Form.Label>
                                <FormControl name='password' type='password' required onChange={onChange}/>
                                <div className="mb-2 d-flex justify-content-md-end align-items-end">
                                  <Button variant="link" size="sm" onClick={forgotPassword}>Forgot Password?</Button>
                                </div>
                              </Form.Group>

                              <Stack gap={3} className="mx-auto">
                                <Button variant="primary" type='submit'> Sign In</Button>

                                <p className="decorated"><span>OR</span></p>

                                <Button variant="dark" onClick={createAccount}><i className="mdi mdi-plus-circle"></i> Create New Account</Button>
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
      formType === 'confirmSingIn' && (
          <Routes>
            <Route path="/" element={<Dashboard clientid={clientid}/>} />
            <Route path="dashboard" element={<Dashboard clientid={clientid}/>} />
            <Route path="profile" element={<Profile clientid={clientid}/>} />
            <Route path="reportDownload" element={<ReportDownload clientid={clientid}/>} />
          </Routes>
      )
    }
  </div>
  );
}


export default App;
