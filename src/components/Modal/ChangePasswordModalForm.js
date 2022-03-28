import React, { useState } from 'react';
import axios from "axios";
import configData from "../../config/index.json"
import { Form, Button, FormControl, Row, Col, Card, Alert } from 'react-bootstrap';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const alertSettings = {
    variant: '', msg: '', alertStatus: false
};

const ChangePasswordModalForm = () => {
    const [alertState, updateAlertState] = useState(alertSettings);
    const [passwordValidity, setPasswordValidity] = useState(false);
    const [cnfpasswordValidity, setcnfPasswordValidity] = useState(false);
    const { alertStatus, variant, msg } = alertState;

    
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

  function onChange(e) {
    e.persist();
    if (e.target.name === 'current_password') {
      var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
      if (e.target.value.match(paswd)) {
        setPasswordValidity(false);
      }
      else {
        setPasswordValidity(true);
      }
    }
    if (e.target.name === 'cnf_password') {
        var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if (e.target.value.match(paswd)) {
            setcnfPasswordValidity(false);
        }
        else {
            setcnfPasswordValidity(true);
        }
      }
      if (e.target.name === 'new_password') {
        var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if (e.target.value.match(paswd)) {
          setPasswordValidity(false);
        }
        else {
          setPasswordValidity(true);
        }
      }

    
    
  }

    return (
        <>
            <Alert show={alertStatus} variant={variant}>{msg}</Alert>
            <Row>
                <Col>
                    <Form id="changepassword">
                        <Form.Group className="mb-1">
                            <div className="row align-items-center ">
                                <div className="col-lg-12 pb-1">
                                    <Form.Label className="mb-0">Current Password</Form.Label>
                                    <FormControl name='current_password' maxLength={15}   type={values.showPassword ? "text" : "password"} onChange={onChange}/>
                                    <i className="toggle-password" onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}>{values.showPassword ? <Visibility /> : <VisibilityOff />}</i>
                                </div>

                                <div className="col-lg-12 pb-1">
                                    <Form.Label className="mb-0">New password</Form.Label>
                                    <FormControl name='new_password' maxLength={15} required isInvalid={passwordValidity}  id="new_password"  type={values.showPassword ? "text" : "password"} onChange={onChange}/>
                                    <i className="toggle-password" onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}>{values.showPassword ? <Visibility /> : <VisibilityOff />}</i>
                                    <Form.Control.Feedback type="invalid" className="text-left">
                                        Password between 7 to 15 characters which contain at least one numeric digit and a special character.
                                    </Form.Control.Feedback>
                                </div>
                                <div className="col-lg-12 pb-1">
                                    <Form.Label className="mb-0">Confirm password</Form.Label>
                                    <FormControl name='cnf_password' maxLength={15} required  isInvalid={cnfpasswordValidity} id="cnf_password"  type={values.showPassword ? "text" : "password"} onChange={onChange}/>
                                    <i className="toggle-password" onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}>{values.showPassword ? <Visibility /> : <VisibilityOff />}</i>
                                    <Form.Control.Feedback type="invalid" className="text-left">
                                        Password between 7 to 15 characters which contain at least one numeric digit and a special character.
                                    </Form.Control.Feedback>
                                </div>
                                <div className="col-lg-12 pt-3">
                                    <Button className='btn-blue float-right' type="submit">Change Password</Button>
                                </div>
                            </div>
                        </Form.Group>
                    </Form>

                </Col>
            </Row>
        </>
    );
};


export default ChangePasswordModalForm;