import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { Button, Container, Card, InputGroup, FormControl, Row, Col, Stack, Alert, Form, Modal } from 'react-bootstrap';
import Dashboard from "./views/dashboard";
import ReportDownload from "./views/reportDownload";
import Profile from "./views/Profile";
import Contract from "./components/Contract"
import configData from "./config/index.json"
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Loader from "./components/Loader";

import './App.css';

import { Auth, Hub } from 'aws-amplify';
import Layout from "./components/Layout";

const initialFormState = {
  rememberme:'', username: '', cin: '', address: '', contactno: '', companyname: '', postion_coords: '', password: '', authCode: '', checkConfirm: false, formType: 'singIn'
};

const alertSettings = {
  variant: '', msg: '', alertStatus: false
};

function App() {
  const [alertState, updateAlertState] = useState(alertSettings);
  const [formState, updateFormState] = useState(initialFormState);
  const [user, updateUser] = useState(null);
  const [clientid, updateClientId] = useState(null);
  const [clientemail, updateEmailId] = useState(null);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validatesignIn, setValidatedSignIn] = useState(false);
  const [validatesignUp, setValidatedSignUp] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState(false);
  const [contactValidity, setContactValidity] = useState(false);
  const [confirmationcodeValidity, setConfirmationcodeValidity] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [activesigninButton, setactivesigninButton] = useState(true);
  const [activesigninnextButton, setactivesigninnextButton] = useState(true);
  const [activeforgotButton, setactiveforgotButton] = useState(true);
  const [activesignupButton, setactivesignupButton] = useState(true);
  const [activesignupnextButton, setactivesignupnextButton] = useState(true);

  // const [logininfo, setUserLoginInfo] = useState()

  const signUp = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    else {
      setShow(true);
    }
    setValidatedSignUp(true);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);

    checkUser()
    setAuthListener()
  }, []);

  async function addressAuto() {
    let autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById('address'),
        { types: ['geocode'] }
    );
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace()
      updateFormState(() => ({ ...formState, address: place.formatted_address }))
    });
  }

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      if (user) {
        let url = configData.express_url
        var postData = { email: user.attributes.email }
        let clientDetails = await axios.post(url + "client/getClientId", postData)
        let kompass_id = clientDetails.data.client_id
        let email_id = clientDetails.data.client_email
        if (kompass_id !== "undifined" && kompass_id !== '') {
          updateClientId(kompass_id);
          updateEmailId(email_id)
        }


        updateUser(user)
        updateFormState(() => ({ ...formState, formType: 'confirmSingIn' }))
      }
    } catch (err) {
      updateUser(null)
    }
  }

  const { alertStatus, variant, msg } = alertState;

  async function setAuthListener() {
    var msg = '';
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn_failure':
          msg = data.payload.data.message
          updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }))
          setTimeout(() => {
            updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
          }, 3000);
          setValidatedSignIn(false);
          break;
        case 'configured':
          msg = data.payload.data.message
          updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'success', msg: msg }))
          setTimeout(() => {
            updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
          }, 3000);
      }
    });
  }

  const { formType } = formState;

  async function createAccount() {
    updateFormState(() => ({ ...formState, formType: 'signUp' }))
    updateAlertState(() => ({ ...alertState, alertStatus: false }))
    setPasswordValidity(false);
  }

  async function Backtosignin() {
    updateFormState(() => ({ ...formState, formType: 'singIn' }))
    updateAlertState(() => ({ ...alertState, alertStatus: false }))
    setPasswordValidity(false);
  }


  function onChange(e) {
    e.persist();
    updateAlertState(() => ({ ...alertState, alertStatus: false }))
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
    if(e.target.name==="email"  ||  e.target.value==="")
    {
    setactivesigninButton(true)
    setactiveforgotButton(true)
    }
    else
    {
    setactivesigninButton(false)  
    setactiveforgotButton(false)
    }
    if(e.target.name==="companyname" || e.target.name==="username" || e.target.name==="cin" &&  e.target.value==="")
    {
    setactivesignupButton(true)
    
    }
    else
    {
    setactivesignupButton(false)  
    }
    if(e.target.name==="contactno" || e.target.name==="address" || e.target.name==="password" &&  e.target.value==="")
    {
    setactivesignupnextButton(true)
    
    }
    else
    {
    setactivesignupnextButton(false)  
    }
    
    
    if (e.target.name === 'password') {
      var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
      if (e.target.value.match(paswd)) {
        setPasswordValidity(false);
      }
      else {
        setPasswordValidity(true);
      }
    }

    if (e.target.name === 'contactno') {

      if (e.target.value === '' || e.target.value.length === 10) {

        setContactValidity(false);
      }
      else {
        setContactValidity(true);

      }
    }

    if (e.target.name === 'authCode') {

      if (e.target.value === '' || e.target.value.length === 6) {

        setConfirmationcodeValidity(false);
      }
      else {
        setConfirmationcodeValidity(true);

      }
    }
  }

  async function confirmContract() {
    setShow(false)
    const { username, password, checkConfirm } = formState;
    if (!checkConfirm) {
      var msg = 'Please accept the agreement to create the account.'
      updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }))
    }
    else {
      //Add Data Captured to Kompass
      navigator.geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords;
            var postion_coords = 'Lat: ' + latitude + ' Long: ' + longitude;
            const { companyname, cin, contactno, address } = formState;
            let url = configData.express_url
            var postData = { 'client_name': companyname, 'cin': cin, 'email': username, 'contact_no': contactno, 'address': address, 'postions': postion_coords }
            let updateClient = await axios.post(url + "client/createMClient", postData)
            if (updateClient.data === 'success') {
              try {
                await Auth.signUp({ username, password })
                updateFormState(() => ({ ...formState, formType: 'confirmSignUp' }))
              }
              catch (err) {
                msg = 'An account with the given email already exists.'
                updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }))
                setTimeout(() => {
                  updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
                }, 3000);
              }
            }
            else {
              var msg = 'Unable to create account.Please try again'
              updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }))
              setTimeout(() => {
                updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
              }, 3000);
            }
          })

    }
  }
  async function closeContract() {
    setShow(false)
  }
  async function confirmSignUp(e) {
    e.preventDefault();
    const { username, authCode } = formState;
    await Auth.confirmSignUp(username, authCode)
        .then(data => {
          updateFormState(() => ({ ...formState, formType: 'singIn' }))
          var msg = 'SignUp  Success'
          updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'success', msg: msg }))
          setTimeout(() => {
            updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
          }, 3000);
        })
        .catch(err => {

          var msg = 'Invalid code please enter valid code'
          updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }))
          setTimeout(() => {
            updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
          }, 3000);

        })

  }
  async function signIn(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    else {
      const { username, password,rememberme } = formState;
      await Auth.signIn(username, password);
      updateFormState(() => ({ ...formState, formType: 'confirmSingIn' }))
      if(rememberme==='on'){
        try{
          const result = await Auth.rememberDevice();
        }catch (error) {
          console.log('Error remembering device', error)
        }
      }
      // setUserLoginInfo(username,password)
      // store the user in localStorage
      // localStorage.setItem('user', username,password)
      // console.log(username,password)
    }
    setValidatedSignIn(true);
  }


  async function resetPassword(e) {
    e.preventDefault();
    const { username, authCode, password } = formState;
    Auth.forgotPasswordSubmit(username, authCode, password)
        .then(data => {
          updateFormState(() => ({ ...formState, formType: 'singIn' }))
          var msg = 'Password Reset Success'
          updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'success', msg: msg }))
          setTimeout(() => {
            updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
          }, 3000);
        })
        .catch(err => {
          var msg = 'Invalid code'
          updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }))
          setTimeout(() => {
            updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
          }, 3000);
        });
  }

  async function forgotPassword() {
    const { username } = formState;
    Auth.forgotPassword(username)
        .then(data => {
          updateFormState(() => ({ ...formState, formType: 'newPassword' }));
          var msg = 'Verification code sent to email';
          updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'success', msg: msg }));
          setTimeout(() => {
            updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
          }, 3000);
        })
        .catch(err => {
          console.log(err);
          var msg = 'Plase enter email id';
          updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }));
          setTimeout(() => {
            updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
          }, 3000);
        });
  }

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
      <>
        {loading === false ? (
            <div className="App">
              {
                formType === 'signUp' && (
                    <div>
                      <Container fluid className="bg-block bg-gray login-card-block">
                        <Row>
                          <Col>
                            <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                            <Card border="light" className='shadow rounded signup-card'>
                              <Row className="m-0">
                                <Col className="col-md-5 d-md-flex align-items-center justify-content-center big-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center">
                                    <Col>
                                      <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                      <Card.Img variant="top" src={require('./illustration.png')} style={{ width: '350px' }} />
                                    </Col>
                                  </Card.Body>
                                </Col>
                                <Col className="col-md-7 px-4 small-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 top-image-block">
                                    <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                  </Card.Body>
                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 pt-md-4">
                                    <h4 className="mb-0">
                                      Create Your Account
                                    </h4>
                                  </Card.Body>
                                  <Card.Body>
                                    <div className="col-lg-12">
                                      <div className="col-lg-12 p-0 form-group">
                                        <div className="google-button img-fluid w-100 cursor-pointer">
                                          <img src={require('./google-icon.png')} alt="google" loading="lazy"/>
                                          <div className="google-button-container w-100 text-center">
                                            Continue with Google
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Card.Body>

                                  <div className="col-lg-12 px-4">
                                    <h2 className="divide-section"><span>&nbsp;OR&nbsp;</span></h2>
                                  </div>

                                  <Card.Body>
                                    <Form noValidate validated={validatesignUp} onSubmit={signUp}>
                                      <Form.Group className="mb-1">
                                        <div className="row">
                                          <div className="col-lg-12 pb-3">
                                            <Form.Label className="mb-0">Company Name</Form.Label>
                                            <FormControl name='companyname'
                                                         required
                                                         type='text'
                                                         autoFocus="TRUE"
                                                         className="shadow-none"
                                                         onChange={onChange} />
                                            <Form.Control.Feedback type="invalid" className="text-left">
                                              Please provide a company name.
                                            </Form.Control.Feedback>
                                          </div>

                                          <div className="col-lg-12 pb-3">
                                            <Form.Label className="mb-0">Email</Form.Label>
                                            <FormControl name='username'
                                                         required
                                                         type='email'
                                                         className="shadow-none"
                                                         onChange={onChange} />
                                            <Form.Control.Feedback type="invalid" className="text-left">
                                              Please provide a user name.
                                            </Form.Control.Feedback>
                                          </div>

                                          <div className="col-lg-12 pb-3">
                                            <Form.Label className="mb-0">CIN</Form.Label>
                                            <FormControl name='cin'
                                                         required
                                                         type='text'
                                                         maxLength={21}
                                                         className="shadow-none"
                                                         onChange={onChange} />
                                            <Form.Control.Feedback type="invalid" className="text-left">
                                              Please provide a CIN number.
                                            </Form.Control.Feedback>
                                          </div>

                                          <div className="col-lg-12 f-14">
                                            <span className="f-11">By signing up, you agree to the Moonlyte</span>
                                          </div>

                                          <div className="col-lg-12 f-14">
                                            <a className="c-blue-link cursor-pointer f-11 font-bolder">Terms of Use</a> <span className="text-black f-11">&</span> <a className="c-blue-link cursor-pointer f-11 font-bolder" href="https://www.evaluationz.com/privacy" target="_blank">Privacy Policies</a>
                                          </div>

                                          <div className="col-lg-12 pt-3 pb-2">
                                            <Button className='btn-blue'
                                                    type='submit' disabled={activesignupButton}
                                                    onClick={()=>{ updateFormState(() => ({ ...formState, formType: 'signUpNext' }))}}>Proceed</Button>
                                          </div>

                                          <div className="col-lg-12 f-14">
                                            <span className="f-11">Already have an account?</span> <a className="c-blue-link cursor-pointer f-11 font-bolder" onClick={Backtosignin}>Sign In</a>
                                          </div>
                                        </div>
                                      </Form.Group>
                                    </Form>
                                  </Card.Body>
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                )
              }
              {
                formType === 'signUpNext' && (
                    <div>
                      <Modal show={show} onHide={closeContract}>
                        <Modal.Header closeButton>
                          <Modal.Title>Service Agreement</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Stack gap={4} className="mx-auto">
                            <InputGroup>
                              <Contract formState={formState} />
                            </InputGroup>
                            <Form.Check type='checkbox'>
                              <Form.Check.Input onChange={onChange} name='checkConfirm' />
                              <Form.Check.Label style={{ fontSize: 13 }}>I have read and agreed to the service agreement for Pre-Employment Screening Service</Form.Check.Label>
                            </Form.Check>
                          </Stack>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button className='btn-blue' onClick={confirmContract}>I Agree</Button>
                        </Modal.Footer>
                      </Modal>

                      <Container fluid className="bg-block bg-gray login-card-block">
                        <Row>
                          <Col className='py-4'>
                            <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                            <Card border="light" className='shadow rounded signup-card'>
                              <Row>
                                <Col className="col-md-5 d-md-flex align-items-center justify-content-center big-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center">
                                    <Col>
                                      <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                      <Card.Img variant="top" src={require('./illustration.png')} style={{ width: '350px' }} />
                                    </Col>
                                  </Card.Body>
                                </Col>

                                <Col className="col-md-7 px-4 small-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 top-image-block">
                                    <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                  </Card.Body>
                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 pt-md-4">
                                    <h4 className="mb-0">
                                      Create Your Account
                                    </h4>
                                  </Card.Body>
                                  <Card.Body>
                                    <Form noValidate validated={validatesignUp} onSubmit={signUp}>
                                      <Form.Group className="">
                                        <div className="row align-items-center">
                                          <div className="col-lg-12 pb-3">
                                            <Form.Label className="mb-0">Address</Form.Label>
                                            <FormControl name='address'
                                                         id='address'
                                                         className="shadow-none"
                                                         required
                                                         type='text'
                                                         onFocus={addressAuto}
                                                         onChange={onChange} />
                                            <Form.Control.Feedback type="invalid" className="text-left">
                                              Please provide a address.
                                            </Form.Control.Feedback>
                                          </div>

                                          <div className="col-lg-12 pb-3">
                                            <Form.Label className="mb-0">Contact No</Form.Label>
                                            <InputGroup className="p-0">
                                              <InputGroup.Text id="basic-addon1" className="shadow-none f-12">+91</InputGroup.Text>
                                              <FormControl name='contactno'
                                                           required
                                                           isInvalid={contactValidity}
                                                           className="shadow-none-sm"
                                                           type='number'
                                                           onChange={onChange} />
                                            </InputGroup>

                                            <Form.Control.Feedback type="invalid" className="text-left">
                                              Please provide a valid contact number.
                                            </Form.Control.Feedback>
                                          </div>

                                          <div className="col-lg-12 pb-3">
                                            <Form.Label className="mb-0">Password</Form.Label>
                                            <FormControl isInvalid={passwordValidity}
                                                         name='password'
                                                         maxLength={15}
                                                         className="shadow-none"
                                                         id="password"
                                                         autoComplete="off"
                                                         required
                                                         type={values.showPassword ? "text" : "password"}
                                                         onChange={onChange} />
                                            <i className="toggle-password" onClick={handleClickShowPassword}
                                               onMouseDown={handleMouseDownPassword}>{values.showPassword ? <Visibility /> : <VisibilityOff />}</i>

                                            <Form.Control.Feedback type="invalid" className="text-left">
                                              Password between 7 to 15 characters which contain at least one numeric digit and a special character.
                                            </Form.Control.Feedback>
                                          </div>

                                          <div className="col-lg-12 f-14">
                                            <span className="f-11">By signing up, you agree to the Moonlyte</span>
                                          </div>

                                          <div className="col-lg-12 f-14">
                                            <a className="c-blue-link cursor-pointer f-11 font-bolder">Terms of Use</a> <span className="text-black f-11">&</span> <a className="c-blue-link cursor-pointer f-11 font-bolder" href="https://www.evaluationz.com/privacy" target="_blank">Privacy Policies</a>
                                          </div>

                                          <div className="col-lg-12 pt-3 pb-2">
                                            <Button className='btn-white float-left'
                                                    onClick={()=>{ updateFormState(() => ({ ...formState, formType: 'signUp' }))}}>Back</Button>

                                            <Button type='submit' className="float-right btn-blue" disabled={activesignupnextButton}> Create Account</Button>
                                          </div>

                                          <div className="col-lg-12 f-14">
                                            <span className="f-11">Already have an account?</span> <a className="c-blue-link cursor-pointer f-11 font-bolder" onClick={Backtosignin}>Sign In</a>
                                          </div>
                                        </div>
                                      </Form.Group>
                                    </Form>
                                  </Card.Body>
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                )
              }
              {
                formType === 'confirmSignUp' && (
                    <div>
                      <Container fluid className="bg-block bg-gray login-card-block">
                        <Row>
                          <Col>
                            <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                            <Card border="light" className='shadow rounded signin-card'>
                              <Row className="m-0">
                                <Col className="col-md-5 d-md-flex align-items-center justify-content-center big-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center">
                                    <Col>
                                      <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                      <Card.Img variant="top" src={require('./illustration.png')} style={{ width: '350px' }} />
                                    </Col>
                                  </Card.Body>
                                </Col>
                                <Col className="col-md-7 px-4 small-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 top-image-block">
                                    <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                  </Card.Body>

                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 pt-md-4">
                                    <h4 className="mb-0">
                                      Verify your Account
                                    </h4>
                                  </Card.Body>

                                  <Card.Body>
                                    <Form.Group className="mb-1">
                                      <div className="row align-items-center ">
                                        <div className="col-lg-12 pb-3">
                                          <Form.Label className="mb-0">Confirmation Code</Form.Label>
                                          <FormControl name='authCode'
                                                       isInvalid={confirmationcodeValidity}
                                                       type='number'
                                                       className="shadow-sm"
                                                       onChange={onChange} />
                                          <Form.Control.Feedback type="invalid" className="text-left">
                                            Please provide 6 digit number.
                                          </Form.Control.Feedback>
                                        </div>

                                        <div className="col-lg-12 py-3">
                                          <Button type='submit' className="btn-blue" onClick={resetPassword}>Proceed</Button>
                                        </div>

                                        <div className="col-lg-12">
                                          <a className="c-blue-link cursor-pointer f-11 font-bolder" onClick={Backtosignin}>Return to Sign IN</a>
                                        </div>
                                      </div>
                                    </Form.Group>
                                  </Card.Body>
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                )
              }
              {
                formType === 'newPassword' && (
                    <div>
                      <Container fluid className="bg-block bg-gray login-card-block">
                        <Row>
                          <Col>
                            <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                            <Card border="light" className='shadow rounded signin-card'>
                              <Row className="m-0">
                                <Col className="col-md-5 d-md-flex align-items-center justify-content-center big-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center">
                                    <Col>
                                      <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                      <Card.Img variant="top" src={require('./illustration.png')} style={{ width: '350px' }} />
                                    </Col>
                                  </Card.Body>
                                </Col>
                                <Col className="col-md-7 px-4 small-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 top-image-block">
                                    <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                  </Card.Body>

                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 pt-md-4">
                                    <h4 className="mb-0">
                                      Verfiy your Account
                                    </h4>
                                  </Card.Body>

                                  <Card.Body>
                                    <Form.Group className="mb-1">
                                      <div className="row align-items-center ">
                                        <div className="col-lg-12 pb-3">
                                          <Form.Label className="mb-0">Confirmation Code</Form.Label>
                                          <FormControl name='authCode'
                                                       isInvalid={confirmationcodeValidity}
                                                       type='number'
                                                       required
                                                       className="shadow-sm"
                                                       onChange={onChange} />
                                          <Form.Control.Feedback type="invalid" className="text-left">
                                            Please provide 6 digit number
                                          </Form.Control.Feedback>
                                        </div>

                                        <div className="col-lg-12 pb-1">
                                          <Form.Label className="mb-0">New Password</Form.Label>
                                          <FormControl isInvalid={passwordValidity}
                                                       name='password'
                                                       className="shadow-sm"
                                                       required
                                                       type={values.showPassword ? "text" : "password"}
                                                       id="cnfpassword"
                                                       autoComplete="off"
                                                       onChange={onChange} />
                                          <i className="toggle-password" onClick={handleClickShowPassword}
                                             onMouseDown={handleMouseDownPassword}>{values.showPassword ? <Visibility /> : <VisibilityOff />}</i>

                                          <Form.Control.Feedback type="invalid" className="mb-0 text-left">
                                            Password between 7 to 15 characters which contain at least one numeric digit and a special character.
                                          </Form.Control.Feedback>
                                        </div>

                                        <div className="col-lg-12 pt-2">
                                          <a onClick={forgotPassword} className="c-blue-link cursor-pointer f-11 font-bolder">Request confirmation code</a>
                                        </div>

                                        <div className="col-lg-12 py-3">
                                          <Button type='submit' className="btn-blue" onClick={resetPassword}>Proceed</Button>
                                        </div>

                                        <div className="col-lg-12">
                                          <a className="c-blue-link cursor-pointer f-11 font-bolder" onClick={Backtosignin}>Return to Sign IN</a>
                                        </div>
                                      </div>
                                    </Form.Group>
                                  </Card.Body>
                                </Col>
                              </Row>
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
                      <Container fluid className="bg-block bg-gray login-card-block">
                        <Row>
                          <Col className="py-4">
                            <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                            <Card border="light" className='shadow rounded signin-card'>
                              <Row className="m-0">
                                <Col className="col-md-5 d-md-flex align-items-center justify-content-center big-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center">
                                    <Col>
                                      <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                      <Card.Img variant="top" src={require('./illustration.png')} style={{ width: '350px' }} />
                                    </Col>
                                  </Card.Body>
                                </Col>
                                <Col className="col-md-7 px-4 small-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 top-image-block">
                                    <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                  </Card.Body>
                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 pt-md-4">
                                    <h4 className="mb-0">
                                      Sign in to your Account
                                    </h4>
                                  </Card.Body>
                                  <Card.Body>
                                    <div className="col-lg-12">
                                      <div className="col-lg-12 p-0 form-group">
                                        <div className="google-button img-fluid w-100 cursor-pointer">
                                          <img src={require('./google-icon.png')} alt="google" loading="lazy"/>
                                          <div className="google-button-container w-100 text-center">
                                            Continue with Google
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Card.Body>

                                  <div className="col-lg-12 px-4">
                                    <h2 className="divide-section"><span>&nbsp;OR&nbsp;</span></h2>
                                  </div>

                                  <Card.Body>
                                    <Form noValidate validated={validatesignIn} onSubmit={signIn}>
                                      <Form.Group className="">
                                        <div className="row align-items-center">
                                          <div className="col-lg-12">
                                            <Form.Label className="mb-0">Email*</Form.Label>
                                            <FormControl name='username'
                                                         type='email'
                                                         placeholder="Enter Your Email*"
                                                         autocomplete="off"
                                                         autoFocus="TRUE"
                                                         className="shadow-none"
                                                         required
                                                         onChange={onChange} />
                                            <Form.Control.Feedback type="invalid" className="mb-0 text-left">
                                              Enter Your Email
                                            </Form.Control.Feedback>
                                          </div>

                                          <div className="col-lg-12 pt-3 pb-2">
                                            <Button className='btn-blue'
                                                    type='submit' disabled={activesigninButton}
                                                    onClick={()=>{ updateFormState(() => ({ ...formState, formType: 'singInNext' }))}}>Proceed</Button>
                                          </div>

                                          <div className="col-lg-12 f-14">
                                            <span className="f-11">Don't have an account yet?</span> <a onClick={createAccount} className="c-blue-link cursor-pointer f-11 font-bolder text-uppercase">Create One</a>
                                          </div>

                                          <div className="col-lg-12 f-14">
                                            <a className="c-blue-link cursor-pointer f-11 font-bolder">Terms of Use</a> <span className="text-black f-11">&</span> <a className="c-blue-link cursor-pointer f-11 font-bolder" href="https://www.evaluationz.com/privacy" target="_blank">Privacy Policies</a>
                                          </div>
                                        </div>
                                      </Form.Group>
                                    </Form>
                                  </Card.Body>
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                )
              }
              {
                formType === 'singInNext' && (
                    <div>
                      <Container fluid="true" className="bg-block bg-gray login-card-block">
                        <Row className="m-0">
                          <Col className="py-4">
                            <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                            <Card border="light" className='shadow rounded signin-card'>
                              <Row className="m-0">
                                <Col className="col-md-5 d-md-flex align-items-center justify-content-center big-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center">
                                    <Col>
                                      <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                      <Card.Img variant="top" src={require('./illustration.png')} style={{ width: '350px' }} />
                                    </Col>
                                  </Card.Body>
                                </Col>
                                <Col className="col-md-7 px-4 small-screen-block">
                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 top-image-block">
                                    <Card.Img variant="top" src={require('./blueg-logo.png')} style={{ width: '150px' }} />
                                  </Card.Body>
                                  <Card.Body className="d-flex align-items-center justify-content-center pb-0 pt-md-4">
                                    <h4 className="mb-0">
                                      Enter your Password
                                    </h4>
                                  </Card.Body>
                                  <Card.Body>
                                    <Form noValidate validated={validatesignIn} onSubmit={signIn}>
                                      <Form.Group className="">
                                        <div className="row align-items-center">
                                          <div className="col-lg-12 pb-1">
                                            <Form.Label className="mb-0">Password*</Form.Label>
                                            <FormControl name='password'
                                                         className="shadow-none"
                                                         placeholder="Enter your Password*"
                                                         type={values.showPassword ? "text" : "password"}
                                                         maxLength={15}
                                                         autoComplete="off"
                                                         autoFocus="TRUE"
                                                         required
                                                         onChange={onChange} />
                                            <i className="toggle-password" onClick={handleClickShowPassword}
                                               onMouseDown={handleMouseDownPassword}>{values.showPassword ? <Visibility /> : <VisibilityOff />}</i>
                                            <Form.Control.Feedback type="invalid" className="mb-0 text-left">
                                              Enter Your Password.
                                            </Form.Control.Feedback>

                                            <div className="row mt-1">
                                              <div className="col-6">
                                                <div className="form-check pl-0">
                                                  <input className="form-check-input ml-0"
                                                         type="checkbox"
                                                         name="rememberme" onChange={onChange} id="flexCheckDefault"/>
                                                  <label className="form-check-label mt-1 f-12"
                                                         htmlFor="flexCheckDefault"> Remember me </label>
                                                </div>
                                              </div>
                                              <div className="col-6">
                                                <div className="mb-2 d-flex justify-content-end align-items-end">
                                                  <a onClick={forgotPassword} className="c-blue-link cursor-pointer f-12 font-bolder" disabled={activeforgotButton}>Forgot Password?</a>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="col-lg-12 py-3">
                                            <Button className='btn-white float-left'
                                                    onClick={()=>{ updateFormState(() => ({ ...formState, formType: 'singIn' }))}}>Back</Button>

                                            <Button className='btn-blue float-right'  type='submit' > Sign In</Button>
                                          </div>

                                          <div className="col-lg-12 f-14">
                                            <a className="c-blue-link cursor-pointer f-11 font-bolder">Terms of Use</a> <span className="text-black f-11">&</span> <a className="c-blue-link cursor-pointer f-11 font-bolder" href="https://www.evaluationz.com/privacy" target="_blank">Privacy Policies</a>
                                          </div>
                                        </div>
                                      </Form.Group>
                                    </Form>
                                  </Card.Body>
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                )
              }
              {
                formType === 'confirmSingIn' && (
                    <Routes>
                      <Route path="/" element={<Dashboard clientid={clientid} />} />
                      <Route path="dashboard" element={<Dashboard clientid={clientid} />} />
                      <Route path="profile" element={<Profile clientemail={clientemail} />} />
                      <Route path="reportDownload" element={<ReportDownload clientid={clientid} />} />
                    </Routes>
                )
              }
            </div>
        ) : (
            <Loader />
        )}
      </>
  );
}


export default App;