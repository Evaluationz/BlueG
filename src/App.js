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
import { useCookies } from 'react-cookie';

import './App.css';

import { Auth, Hub } from 'aws-amplify';

const initialFormState = {
  username: '', cin: '', address: '', contactno: '', companyname: '', postion_coords: '', password: '', authCode: '', checkConfirm: false, formType: 'singIn'
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

  useEffect(() => {
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
      const { username, password } = formState;
      await Auth.signIn(username, password);
      updateFormState(() => ({ ...formState, formType: 'confirmSingIn' }))
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

                <Container fluid className="bg-block bg-light-gray login-card-block">
                  <Row>
                    <Col>
                      <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                      <Card border="light" className='shadow rounded signup-card'>
                        <Row>
                          <Col>
                            <Card.Body className="d-flex align-items-center justify-content-center">
                              <Card.Img variant="top" src={require('./logo-black.png')} style={{ width: '200px' }} /><Card.Img variant="top" src={require('./logo.png')} style={{ width: '50px' }} />
                            </Card.Body>
                            <Card.Body className="d-flex align-items-center justify-content-center py-0">
                              <h6 className="mb-0" style={{ fontWeight: '600' }}>
                                SIGN UP with BlueG
                              </h6>
                            </Card.Body>
                            <Card.Body>
                              <Form noValidate validated={validatesignUp} onSubmit={signUp}>
                                <Form.Group className="mb-1">
                                  <div className="row">
                                    <div className="col-md-6 pb-3">
                                      <FormControl name='companyname' required type='text' className="shadow-sm" placeholder="Company name" onChange={onChange} />
                                      <Form.Control.Feedback type="invalid" className="text-left">
                                        Please provide a company name.
                                      </Form.Control.Feedback>
                                    </div>

                                    <div className="col-md-6 pb-3">
                                      <FormControl name='username' required type='email' className="shadow-sm" placeholder="Email address" onChange={onChange} />
                                      <Form.Control.Feedback type="invalid" className="text-left">
                                        Please provide a user name.
                                      </Form.Control.Feedback>
                                    </div>

                                    <div className="col-md-6 pb-3">
                                      <FormControl name='cin' required type='text' maxLength={21} className="shadow-sm" placeholder="CIN" onChange={onChange} />
                                      <Form.Control.Feedback type="invalid" className="text-left">
                                        Please provide a CIN number.
                                      </Form.Control.Feedback>
                                    </div>

                                    <div className="col-md-6 pb-3">
                                      <FormControl name='address' id='address' className="shadow-sm" required type='text' placeholder="Address" onFocus={addressAuto} onChange={onChange} />
                                      <Form.Control.Feedback type="invalid" className="text-left">
                                        Please provide a address.
                                      </Form.Control.Feedback>
                                    </div>

                                    <div className="col-md-6 pb-3">
                                      <FormControl name='contactno' required isInvalid={contactValidity} className="shadow-sm" type='number' placeholder="Contact number" onChange={onChange} />
                                      <Form.Control.Feedback type="invalid" className="text-left">
                                        Please provide a valid contact number.
                                      </Form.Control.Feedback>
                                    </div>

                                    <div className="col-md-6 pb-3">
                                      <FormControl isInvalid={passwordValidity} name='password' maxLength={15} className="shadow-sm" id="password" autoComplete="off" required type={values.showPassword ? "text" : "password"} placeholder="Password" onChange={onChange} />
                                      <i className="toggle-password" onClick={handleClickShowPassword}
                                         onMouseDown={handleMouseDownPassword}>{values.showPassword ? <Visibility /> : <VisibilityOff />}</i>

                                      <Form.Control.Feedback type="invalid" className="text-left">
                                        Password between 7 to 15 characters which contain at least one numeric digit and a special character.
                                      </Form.Control.Feedback>
                                    </div>

                                    <div className="col-12 pt-2">
                                      <a className="float-left c-blue font-bold cursor-pointer mt-2" onClick={Backtosignin}><i className="mdi mdi-chevron-left"></i>Back to Sign In</a>
                                      <Button type='submit' className="float-right btn-blue"> Sign Up</Button>
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
                <Container fluid className="bg-block bg-light-gray login-card-block">
                  <Row>
                    <Col>
                      <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                      <Card border="light" className='shadow rounded login-card'>
                        <Card.Body>
                          <Form>
                            <Form.Group className="">
                              <div className="row align-items-center ">
                                <div className="col-lg-12 pb-3">
                                  <Form.Label className="mb-0">Confirmation code</Form.Label>
                                  <FormControl name='authCode' isInvalid={confirmationcodeValidity} type='number' placeholder="Confirmation code" onChange={onChange} />
                                  <Form.Control.Feedback type="invalid" className="text-left">
                                    Please provide 6 digit number.
                                  </Form.Control.Feedback>
                                </div>
                              </div>

                              <div className="col-lg-12 py-3">
                                <Button className='btn-blue' type="submit" onClick={confirmSignUp}> Confirm Sign-Up</Button>
                              </div>
                            </Form.Group>
                          </Form>
                        </Card.Body>
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
                <Container fluid className="bg-block bg-light-gray login-card-block">
                  <Row>
                    <Col>
                      <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                      <Card border="light" className='shadow rounded password-card'>
                        <Card.Body className="d-flex align-items-center justify-content-center pt-3 pb-1">
                          <h5 className="mb-0" style={{ fontWeight: '600' }}>
                            Change Password
                          </h5>
                        </Card.Body>
                        <Card.Body>
                          <Form.Group className="mb-1">
                            <div className="row align-items-center ">
                              <div className="col-lg-12 pb-3">
                                <Form.Label className="mb-0">Confirmation code</Form.Label>
                                <FormControl name='authCode' isInvalid={confirmationcodeValidity} type='number' required placeholder="Confirmation code" onChange={onChange} />
                                <Form.Control.Feedback type="invalid" className="text-left">
                                  Please provide 6 digit number
                                </Form.Control.Feedback>
                              </div>

                              <div className="col-lg-12 pb-1">
                                <Form.Label className="mb-0">Password</Form.Label>
                                <FormControl isInvalid={passwordValidity} name='password' required type={values.showPassword ? "text" : "password"} id="cnfpassword" placeholder="Password" autoComplete="off" onChange={onChange} />
                                <i className="toggle-password" onClick={handleClickShowPassword}
                                   onMouseDown={handleMouseDownPassword}>{values.showPassword ? <Visibility /> : <VisibilityOff />}</i>

                                <Form.Control.Feedback type="invalid" className="mb-0 text-left">
                                  Password between 7 to 15 characters which contain at least one numeric digit and a special character.
                                </Form.Control.Feedback>
                              </div>

                              <div className="col-lg-12 py-3">
                                <a className="float-left c-blue font-bold cursor-pointer mt-2" onClick={Backtosignin}><i className="mdi mdi-chevron-left"></i>Back</a>
                                <Button type='submit' className="float-right btn-blue" onClick={resetPassword}>Submit</Button>
                              </div>

                              <div className="col-lg-12">
                                <a onClick={forgotPassword} className="c-blue cursor-pointer f-14 font-bold">Request code again</a>
                              </div>
                            </div>
                          </Form.Group>
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
                <Container fluid className="bg-block bg-light-gray login-card-block">
                  <Row>
                    <Col>
                      <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                      <Card border="light" className='shadow rounded signin-card'>
                        <Row>
                          <Col>
                            <Card.Body className="d-flex align-items-center justify-content-center">
                              <Card.Img variant="top" src={require('./logo-black.png')} style={{ width: '200px' }} /><Card.Img variant="top" src={require('./logo.png')} style={{ width: '50px' }} />
                            </Card.Body>
                            <Card.Body className="d-flex align-items-center justify-content-center py-0">
                              <h6 className="mb-0" style={{ fontWeight: '600' }}>
                                SIGN IN with BlueG
                              </h6>
                            </Card.Body>
                            <Card.Body>
                              <Form noValidate validated={validatesignIn} onSubmit={signIn}>
                                <Form.Group className="">
                                  <div className="row align-items-center ">
                                    <div className="col-lg-12 pb-3">
                                      <Form.Label className="mb-0">Email</Form.Label>
                                      <FormControl name='username' type='email' className="shadow-sm" required onChange={onChange} />
                                      <Form.Control.Feedback type="invalid" className="mb-0 text-left">
                                        Enter Your Email
                                      </Form.Control.Feedback>
                                    </div>

                                    <div className="col-lg-12 pb-1">
                                      <Form.Label className="mb-0">Password</Form.Label>
                                      <FormControl name='password' className="shadow-sm" type={values.showPassword ? "text" : "password"} maxLength={15} autoComplete="off" required onChange={onChange} />
                                      <i className="toggle-password" onClick={handleClickShowPassword}
                                         onMouseDown={handleMouseDownPassword}>{values.showPassword ? <Visibility /> : <VisibilityOff />}</i>
                                      <Form.Control.Feedback type="invalid" className="mb-0 text-left">
                                        Enter Your Password.
                                      </Form.Control.Feedback>

                                      <div className="row mt-1">
                                        {/* <div className="col-6">
                                          <div className="form-check pl-0">
                                            <input className="form-check-input ml-0"
                                                   type="checkbox"
                                                   value="" id="flexCheckDefault"/>
                                            <label className="form-check-label f-14"
                                                   htmlFor="flexCheckDefault"> Remember me </label>
                                          </div>
                                        </div> */}
                                        <div className="col-12">
                                          <div className="mb-2 d-flex justify-content-end align-items-end">
                                            <a onClick={forgotPassword} className="c-blue cursor-pointer f-14 font-bold">Forgot Password?</a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-lg-12 py-3">
                                      <Button className='btn-blue' type='submit'> Sign In</Button>
                                    </div>

                                    <div className="col-lg-12 f-14">
                                      Does not have an account? <a onClick={createAccount} className="c-blue cursor-pointer f-14 font-bold">Create New</a>
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
  );
}


export default App;
