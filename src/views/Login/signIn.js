import React, { useState, useEffect } from 'react';
import { Button, Container, Card, InputGroup, FormControl, Row, Col, Stack, Alert, Form, Modal } from 'react-bootstrap';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import axios from "axios";
import configData from "../../config/index.json"
import '../../styles.scss';
import { Auth, Hub } from 'aws-amplify';

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';


const initialFormState = {
    username: '', password: '', authCode: '', user: '', formType: 'signIn'
};

const alertSettings = {
    variant: '', msg: '', alertStatus: false
};

const fieldValidationSettings = { emailValidity: false, passwordValidity: false, confirmationcodeValidity: false }
const buttonActiveSettings = { emailButton: false, passwordButton: true, forgotButton: true }
function SignIn({ stateChanger, ...rest }, props) {
    const [formState, updateFormState] = useState(initialFormState);
    const [alertState, updateAlertState] = useState(alertSettings);
    const [validatesignIn, setValidatedSignIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fieldValidityState, updatefieldValidity] = useState(fieldValidationSettings);
    const [buttonState, updateButtonState] = useState(buttonActiveSettings);

    useEffect(() => {
        setAuthListener()
    }, []);
    // Google Signin
    async function handleGoogleLogin(response) {
        const user = response.profileObj.email;
        const token = response.tokenId
        const expires_at = response.tokenObj.expires_in * 1000 + new Date().getTime();
        try {
            let url = configData.express_url
            var postData = { clientemail: user }
            let clientDetails = await axios.post(url + "bgProfile/GetUserProfile", postData)
            if (clientDetails.data[0]) {
                await Auth.federatedSignIn(
                    "google",
                    { token, expires_at },
                    user
                )
                stateChanger('confirmSingIn')
            }
            else {
                var msg = 'Email not found. Create an account'
                updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }))
                setTimeout(() => {
                    updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
                }, 3000);
                }
        }
        catch (e) {
            console.log(e)
            var msg = 'Something went wrong.! Please try again.'
            updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }))
            setTimeout(() => {
                updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
            }, 3000);
            
        }

    }

    // facebook login
    async function handleFacebookLogin(response) {
        const user = response.email;
        const token = response.accessToken
        const expires_at = response.expiresIn * 1000 + new Date().getTime();
        try {
            let url = configData.express_url
            var postData = { clientemail: user }
            let clientDetails = await axios.post(url + "bgProfile/GetUserProfile", postData)
            if (clientDetails.data[0]) {
                await Auth.federatedSignIn(
                    "facebook",
                    { token, expires_at },
                    user
                );
                stateChanger('confirmSingIn')
            }
            else {
                var msg = 'Email not found. Create an account.'
                updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }))
                setTimeout(() => {
                    updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
                }, 3000);
                }
        }
        catch (e) {
            var msg = 'Something went wrong.! Please try again.'
            updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }))
            setTimeout(() => {
                updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
            }, 3000);
        }

    }

    //end
    async function createAccount() {
        stateChanger('signUp');
        updateAlertState(() => ({ ...alertState, alertStatus: false }));
        updatefieldValidity(() => ({ ...fieldValidityState, passwordValidity: false }))
    }

    async function Backtosignin() {
        updateFormState(() => ({ ...formState, formType: 'signIn' }));
        updateAlertState(() => ({ ...alertState, alertStatus: false }));
        updatefieldValidity(() => ({ ...fieldValidityState, passwordValidity: false }))
    }

    async function resetPassword(e) {
        e.preventDefault();
        const { username, authCode, password } = formState;
        Auth.forgotPasswordSubmit(username, authCode, password)
            .then(data => {
                updateFormState(() => ({ ...formState, formType: 'signIn' }));
                var msg = 'Password Reset Success';
                updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'success', msg: msg }));
                setTimeout(() => {
                    updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
                }, 3000);
            })
            .catch(err => {
                var msg = 'Invalid code';
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

    async function forgotPassword() {
        const { username } = formState;
        console.log("forgot", username)
        await Auth.forgotPassword(username)
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

    function onChange(e) {
        e.persist();
        updateAlertState(() => ({ ...alertState, alertStatus: false }))
        updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
        if (e.target.name === 'username' && e.target.value !== "") {
            updateButtonState(() => ({ ...buttonState, emailButton: false, forgotButton: false }));
            console.log('changing state', buttonState)
        }
        else {
            updateButtonState(() => ({ ...buttonState, emailButton: true, forgotButton: true }));
        }

        //sigin password
        if (e.target.name === 'password' && e.target.value === "" || e.target.value === null || e.target.value === undefined) {
            updateButtonState(() => ({ ...buttonState, passwordButton: true }))
        }
        else {
            updateButtonState(() => ({ ...buttonState, passwordButton: false }))
        }

        if (e.target.name === 'username') {
            var email = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
            if (e.target.value.match(email)) {
                updatefieldValidity(() => ({ ...fieldValidityState, emailValidity: false }))
            }
            else {
                updatefieldValidity(() => ({ ...fieldValidityState, emailValidity: true }))
            }
        }

        if (e.target.name === 'password') {
            var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
            if (e.target.value.match(paswd)) {
                updatefieldValidity(() => ({ ...fieldValidityState, passwordValidity: false }))
            }
            else {
                updatefieldValidity(() => ({ ...fieldValidityState, passwordValidity: true }))
            }
        }

        if (e.target.name === 'authCode') {

            if (e.target.value === '' || e.target.value.length === 6) {
                updatefieldValidity(() => ({ ...fieldValidityState, confirmationcodeValidity: false }))
            }
            else {
                updatefieldValidity(() => ({ ...fieldValidityState, confirmationcodeValidity: true }))
            }
        }
    }



    async function setAuthListener() {
        var msg = '';
        Hub.listen('auth', (data) => {
            switch (data.payload.event) {
                case 'signIn_failure':
                    msg = data.payload.data.message;
                    updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }));
                    setTimeout(() => {
                        updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
                    }, 3000);
                    setValidatedSignIn(false);
                    break;
            }
        });
    }

    async function signIn(event) {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            const { username, password, rememberme } = formState;
            //await Auth.signIn(username, password);
            let user = await Auth.signIn(username, password)
            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                updateFormState(() => ({ ...formState, formType: 'tempPassword', user: user }));
            }
            else {
                stateChanger('confirmSingIn');
                if (rememberme === 'on') {
                    try {
                        const result = await Auth.rememberDevice();
                    } catch (error) {
                        console.log('Error remembering device', error)
                    }
                }

            }
            // updateFormState(() => ({ ...formState, formType: 'confirmSingIn' }));

        }
        setValidatedSignIn(true);
    }

    async function resetTempPassword(e) {
        e.preventDefault();
        const { user, password } = formState;
        await Auth.completeNewPassword(user, password)
        stateChanger('confirmSingIn');
    }

    const { formType } = formState;
    const { alertStatus, variant, msg } = alertState;

    const { passwordValidity, emailValidity, confirmationcodeValidity } = fieldValidityState;
    const { emailButton, passwordButton, forgotButton } = buttonState;
    console.log(emailButton);

    return (
        <>
            {
                formType === 'signIn' && (
                    <div>
                        <Container fluid className="bg-block bg-gray login-card-block">
                            <Row>
                                <Col className="py-4">
                                    <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                                    <Card border="light" className='shadow rounded signin-card'>
                                        <Row className="m-0">
                                            <Col className="col-md-5 d-md-flex big-screen-block">
                                                <Card.Body className="h-100 d-flex">
                                                    <Col>
                                                        <Card.Img variant="top" src={require('../../assets/images/blueg-logo.png')} style={{ width: '100px', paddingBottom: '0.9rem', paddingTop: '0.5rem' }} />
                                                        <Card.Img variant="top" src={require('../../assets/images/illustration.png')} style={{ width: '350px' }} />
                                                    </Col>
                                                </Card.Body>
                                            </Col>
                                            <Col className="col-md-7 px-4 small-screen-block">
                                                <Card.Body className="d-flex align-items-center justify-content-center pb-0 top-image-block">
                                                    <Card.Img variant="top" src={require('../../assets/images/blueg-logo.png')} style={{ width: '150px' }} />
                                                </Card.Body>
                                                <Card.Body className="d-flex align-items-center justify-content-center pb-0 pt-md-4">
                                                    <h4 className="mb-0">
                                                        Sign in to your Account
                                                    </h4>
                                                </Card.Body>
                                                <Card.Body>
                                                    <div className="col-lg-12">
                                                        <div className="col-lg-12 p-0 form-group">
                                                        <FacebookLogin
                                                                cssClass="facebook-button img-fluid w-100 cursor-pointer"
                                                                appId="5363009173750221"
                                                                buttonText="Continue with Facebook"
                                                                fields="name,email,picture"
                                                                callback={handleFacebookLogin} 
                                                                icon="fa-facebook"/>

                                                        </div>

                                                        <div className="col-lg-12 p-0 form-group mt-3">
                                                            <GoogleLogin
                                                                className="google-button img-fluid w-100 cursor-pointer"
                                                                clientId="797137270990-ug3c0c6e65ikqj12v5u4lfeu2g1a3c3g.apps.googleusercontent.com"
                                                                buttonText="Continue with Google"
                                                                onSuccess={handleGoogleLogin}
                                                                cookiePolicy={'single_host_origin'}
                                                            />
                                                        </div>
                                                    </div>
                                                </Card.Body>

                                                {/* <div className="col-lg-12 px-4">
                                    <h2 className="divide-section"><span>&nbsp;OR&nbsp;</span></h2>
                                  </div> */}

                                                <Card.Body>
                                                    <Form noValidate validated={validatesignIn} onSubmit={signIn}>
                                                        <Form.Group className="">
                                                            <div className="row align-items-center">
                                                                <div className="col-lg-12">
                                                                    <Form.Label className="mb-0">Email*</Form.Label>
                                                                    <FormControl name='username'
                                                                        isInvalid={emailValidity}
                                                                        type='email'
                                                                        placeholder="Enter Your Email*"
                                                                        autoComplete="off"
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
                                                                        type="submit"
                                                                        disabled={emailButton}
                                                                        onClick={() => { updateFormState(() => ({ ...formState, formType: 'singInNext' })) }}>Proceed</Button>
                                                                </div>

                                                                <div className="col-lg-12 f-14">
                                                                    <span className="f-11">Don't have an account yet?</span> <a onClick={createAccount} className="c-blue-link cursor-pointer f-11 font-bolder text-uppercase">Create One</a>
                                                                </div>

                                                                <div className="col-lg-12 f-14">
                                                                    <a className="c-blue-link cursor-pointer f-11 font-bolder" href="https://www.evaluationz.com/tnc" target="_blank">Terms of Use</a> <span className="text-black f-11">&</span> <a className="c-blue-link cursor-pointer f-11 font-bolder" href="https://www.evaluationz.com/privacy" target="_blank">Privacy Policy</a>
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
                                            <Col className="col-md-5 d-md-flex big-screen-block">
                                                <Card.Body className="h-100 d-flex">
                                                    <Col>
                                                        <Card.Img variant="top" src={require('../../assets/images/blueg-logo.png')} style={{ width: '100px', paddingBottom: '0.9rem', paddingTop: '0.5rem' }} />
                                                        <Card.Img variant="top" src={require('../../assets/images/illustration.png')} style={{ width: '350px' }} />
                                                    </Col>
                                                </Card.Body>
                                            </Col>
                                            <Col className="col-md-7 px-4 small-screen-block">
                                                <Card.Body className="d-flex align-items-center justify-content-center pb-0 top-image-block">
                                                    <Card.Img variant="top" src={require('../../assets/images/blueg-logo.png')} style={{ width: '150px' }} />
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
                                                                    <FormControl isInvalid={passwordValidity} name='password'
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
                                                                                    name="rememberme" onChange={onChange} id="flexCheckDefault" />
                                                                                <label className="form-check-label mt-1 f-12"
                                                                                    htmlFor="flexCheckDefault"> Remember me </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <div className="mb-2 d-flex justify-content-end align-items-end">

                                                                                <a onClick={forgotPassword} className="c-blue-link cursor-pointer f-12 font-bolder" disabled={forgotButton}>Forgot Password?</a>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-12 py-3">
                                                                    <Button className='btn-white float-left'
                                                                        onClick={() => { updateFormState(() => ({ ...formState, formType: 'signIn' })) }}>Back</Button>

                                                                    <Button className='btn-blue float-right'
                                                                        disabled={passwordButton}
                                                                        type='submit' > Sign In</Button>
                                                                </div>

                                                                <div className="col-lg-12 f-14">
                                                                    <a className="c-blue-link cursor-pointer f-11 font-bolder"
                                                                        href="https://www.evaluationz.com/tnc"
                                                                        target="_blank">Terms of Use</a> <span className="text-black f-11">&</span> <a className="c-blue-link cursor-pointer f-11 font-bolder" href="https://www.evaluationz.com/privacy" target="_blank">Privacy Policy</a>
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
                formType === 'newPassword' && (
                    <div>
                        <Container fluid className="bg-block bg-gray login-card-block">
                            <Row>
                                <Col>
                                    <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                                    <Card border="light" className='shadow rounded signin-card'>
                                        <Row className="m-0">
                                            <Col className="col-md-5 d-md-flex big-screen-block">
                                                <Card.Body className="h-100 d-flex">
                                                    <Col>
                                                        <Card.Img variant="top" src={require('../../assets/images/blueg-logo.png')} style={{ width: '100px', paddingBottom: '0.9rem', paddingTop: '0.5rem' }} />
                                                        <Card.Img variant="top" src={require('../../assets/images/illustration.png')} style={{ width: '350px' }} />
                                                    </Col>
                                                </Card.Body>
                                            </Col>
                                            <Col className="col-md-7 px-4 small-screen-block">
                                                <Card.Body className="d-flex align-items-center justify-content-center pb-0 top-image-block">
                                                    <Card.Img variant="top" src={require('../../assets/images/blueg-logo.png')} style={{ width: '150px' }} />
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
                formType === 'tempPassword' && (
                    <div>
                        <Container fluid className="bg-block bg-gray login-card-block">
                            <Row>
                                <Col>
                                    <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                                    <Card border="light" className='shadow rounded signin-card'>
                                        <Row className="m-0">
                                            <Col className="col-md-5 d-md-flex big-screen-block">
                                                <Card.Body className="h-100 d-flex">
                                                    <Col>
                                                        <Card.Img variant="top" src={require('../../assets/images/blueg-logo.png')} style={{ width: '100px', paddingBottom: '0.9rem', paddingTop: '0.5rem' }} />
                                                        <Card.Img variant="top" src={require('../../assets/images/illustration.png')} style={{ width: '350px' }} />
                                                    </Col>
                                                </Card.Body>
                                            </Col>
                                            <Col className="col-md-7 px-4 small-screen-block">
                                                <Card.Body className="d-flex align-items-center justify-content-center pb-0 top-image-block">
                                                    <Card.Img variant="top" src={require('../../assets/images/blueg-logo.png')} style={{ width: '150px' }} />
                                                </Card.Body>

                                                <Card.Body className="d-flex align-items-center justify-content-center pb-0 pt-md-4">
                                                    <h4 className="mb-0">
                                                        Reset Password
                                                    </h4>
                                                </Card.Body>

                                                <Card.Body>
                                                    <Form.Group className="mb-1">
                                                        <div className="row align-items-center ">
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

                                                            {/* <div className="col-lg-12 pt-2">
                                                                <a onClick={forgotPassword} className="c-blue-link cursor-pointer f-11 font-bolder">Request confirmation code</a>
                                                            </div> */}

                                                            <div className="col-lg-12 py-3">
                                                                <Button type='submit' className="btn-blue" onClick={resetTempPassword}>Save</Button>
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
        </>
    );
}

export default SignIn;
