import React, { useState } from 'react';
import axios from "axios";
import { Button, Container, Card, InputGroup, FormControl, Row, Col, Stack, Alert, Form, Modal } from 'react-bootstrap';
import Contract from "../../components/Contract"
import configData from "../../config/index.json"
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import '../../styles.scss';
import { Auth } from 'aws-amplify';

const initialFormState = {
    username: '', cin: '', address: '', contactno: '', companyname: '', postion_coords: '', password: '', checkConfirm: false, authCode: '', formType: 'signUp'
};

const alertSettings = {
    variant: '', msg: '', alertStatus: false
};

const fieldValidationSettings = { contactValidity: false, passwordValidity: false, emailValidity: false, confirmationcodeValidity: false }
const buttonActiveSettings = { activesignupButton: false, activesignupnextButton: true }
function Signup({stateChanger, ...rest}) {
    const [formState, updateFormState] = useState(initialFormState);
    const [alertState, updateAlertState] = useState(alertSettings);
    const [fieldValidityState, updatefieldValidity] = useState(fieldValidationSettings);
    const [buttonActiveState, updateButtonState] = useState(buttonActiveSettings);
    const [show, setShow] = useState(false);
    const [validatesignUp, setValidatedSignUp] = useState(false);

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

    const [values, setValues] = React.useState({
        password: "",
        showPassword: false,
    });

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    async function confirmSignUp(e) {
        e.preventDefault();
        const { username, authCode } = formState;
        await Auth.confirmSignUp(username, authCode)
            .then(data => {    
                stateChanger('singIn')
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

    function onChange(e) {
        e.persist();
        updateAlertState(() => ({ ...alertState, alertStatus: false }))
        updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
        if (e.target.name === "companyname" || e.target.name === "username" || e.target.name === "cin" && e.target.value === "") {
            updateButtonState(() => ({ ...buttonActiveState, activesignupButton: true }))
        }
        else {
            updateButtonState(() => ({ ...buttonActiveState, activesignupButton: false }))
        }
        if (e.target.name === "contactno" || e.target.name === "address" || e.target.name === "password" && e.target.value === "") {
            updateButtonState(() => ({ ...buttonActiveState, activesignupnextButton: true }))
        }
        else {
            updateButtonState(() => ({ ...buttonActiveState, activesignupnextButton: false }))
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

        if (e.target.name === 'contactno') {

            if (e.target.value === '' || e.target.value.length === 10) {
                updatefieldValidity(() => ({ ...fieldValidityState, contactValidity: false }))
            }
            else {
                updatefieldValidity(() => ({ ...fieldValidityState, contactValidity: true }))

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
    const { formType } = formState;
    const { alertStatus, variant, msg } = alertState;
    const { contactValidity, passwordValidity, emailValidity, confirmationcodeValidity } = fieldValidityState;
    const { activesignupButton, activesignupnextButton } = buttonActiveState;

    async function Backtosignin() {
        stateChanger('singIn')
        updateAlertState(() => ({ ...alertState, alertStatus: false }))
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

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
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
    return (
        <>
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
                                                <Card.Body className="h-100 d-flex align-items-center justify-content-center">
                                                    <Col>
                                                        <Card.Img variant="top" src={require('../../assets/images/blueg-logo.png')} style={{ width: '150px' }} />
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
                                                        Create Your Account
                                                    </h4>
                                                </Card.Body>
                                                <Card.Body>
                                                    {/* <div className="col-lg-12">
                                      <div className="col-lg-12 p-0 form-group">
                                        <div className="google-button img-fluid w-100 cursor-pointer">
                                          <img src={require('./assets/images/google-icon.png')} alt="google" loading="lazy"/>
                                          <div className="google-button-container w-100 text-center">
                                            Continue with Google
                                          </div>
                                        </div>
                                      </div>
                                    </div> */}
                                                </Card.Body>

                                                {/* <div className="col-lg-12 px-4">
                                    <h2 className="divide-section"><span>&nbsp;OR&nbsp;</span></h2>
                                  </div> */}

                                                <Card.Body>
                                                    <Form noValidate validated={validatesignUp} onSubmit={signUp}>
                                                        <Form.Group className="mb-1">
                                                            <div className="row">
                                                                <div className="col-lg-12 pb-3">
                                                                    <Form.Label className="mb-0">Company Name*</Form.Label>
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
                                                                    <Form.Label className="mb-0">Email*</Form.Label>
                                                                    <FormControl name='username'
                                                                        isInvalid={emailValidity}
                                                                        required
                                                                        type='email'
                                                                        className="shadow-none"
                                                                        onChange={onChange} />
                                                                    <Form.Control.Feedback type="invalid" className="text-left">
                                                                        Please provide a user name.
                                                                    </Form.Control.Feedback>
                                                                </div>

                                                                <div className="col-lg-12 pb-3">
                                                                    <Form.Label className="mb-0">CIN*</Form.Label>
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
                                                                    <span className="f-11">By signing up, you agree to the blueG</span>
                                                                </div>

                                                                <div className="col-lg-12 f-14">
                                                                    <a className="c-blue-link cursor-pointer f-11 font-bolder">Terms of Use</a> <span className="text-black f-11">&</span> <a className="c-blue-link cursor-pointer f-11 font-bolder" href="https://www.evaluationz.com/privacy" target="_blank">Privacy Policies</a>
                                                                </div>

                                                                <div className="col-lg-12 pt-3 pb-2">
                                                                    <Button className='btn-blue'
                                                                        type="submit"
                                                                        disabled={activesignupButton}
                                                                        onClick={() => { updateFormState(() => ({ ...formState, formType: 'signUpNext' })) }}>Proceed</Button>
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
                                                <Card.Body className="h-100 d-flex align-items-center justify-content-center">
                                                    <Col>
                                                        <Card.Img variant="top" src={require('../../assets/images/blueg-logo.png')} style={{ width: '150px' }} />
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
                                                        Create Your Account
                                                    </h4>
                                                </Card.Body>
                                                <Card.Body>
                                                    <Form noValidate validated={validatesignUp} onSubmit={signUp}>
                                                        <Form.Group className="">
                                                            <div className="row align-items-center">
                                                                <div className="col-lg-12 pb-3">
                                                                    <Form.Label className="mb-0">Address*</Form.Label>
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
                                                                    <Form.Label className="mb-0">Contact No*</Form.Label>
                                                                    <InputGroup className="p-0">
                                                                        <InputGroup.Text id="basic-addon1" className="shadow-none f-12">+91</InputGroup.Text>
                                                                        <FormControl name='contactno'
                                                                            required
                                                                            isInvalid={contactValidity}
                                                                            className="shadow-none-sm"
                                                                            type='number'
                                                                            onChange={onChange} />


                                                                        <Form.Control.Feedback type="invalid" className="text-left bg-white">
                                                                            Please provide a valid contact number.
                                                                        </Form.Control.Feedback>
                                                                    </InputGroup>
                                                                </div>

                                                                <div className="col-lg-12 pb-3">
                                                                    <Form.Label className="mb-0">Password*</Form.Label>
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
                                                                    <span className="f-11">By signing up, you agree to the blueG</span>
                                                                </div>

                                                                <div className="col-lg-12 f-14">
                                                                    <a className="c-blue-link cursor-pointer f-11 font-bolder">Terms of Use</a> <span className="text-black f-11">&</span> <a className="c-blue-link cursor-pointer f-11 font-bolder" href="https://www.evaluationz.com/privacy" target="_blank">Privacy Policies</a>
                                                                </div>

                                                                <div className="col-lg-12 pt-3 pb-2">
                                                                    <Button className='btn-white float-left'
                                                                        onClick={() => { updateFormState(() => ({ ...formState, formType: 'signUp' })) }}>Back</Button>

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
                                                <Card.Body className="h-100 d-flex align-items-center justify-content-center">
                                                    <Col>
                                                        <Card.Img variant="top" src={require('../../assets/images/blueg-logo.png')} style={{ width: '150px' }} />
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
                                                                    className="shadow-sm"
                                                                    onChange={onChange} />
                                                                <Form.Control.Feedback type="invalid" className="text-left">
                                                                    Please provide 6 digit number.
                                                                </Form.Control.Feedback>
                                                            </div>

                                                            <div className="col-lg-12 py-3">
                                                                <Button type='submit' className="btn-blue" onClick={confirmSignUp}>Proceed</Button>
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

export default Signup;
