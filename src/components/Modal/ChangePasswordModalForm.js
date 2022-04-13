import React, { useState } from 'react';
import axios from "axios";
import configData from "../../config/index.json"
import { Form, Button, FormControl, Row, Col, Card, Alert } from 'react-bootstrap';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { Auth, input } from 'aws-amplify';

const alertSettings = {
    variant: '', msg: '', alertStatus: false
};

const initialFormState = { oldPassword:'',newPassword:'',matchPassword:'' }

const ChangePasswordModalForm = () => {
    const [alertState, updateAlertState] = useState(alertSettings);
    const [passwordValidity, setPasswordValidity] = useState(false);
    const [cnfpasswordValidity, setcnfPasswordValidity] = useState(false);
    const { alertStatus, variant, msg } = alertState;
    const [formState, updateFormState] = useState(initialFormState);

    
  const [currentvalues, setCurrentValues] = React.useState({
    password: "",
    showCurrentPassword: false,
  });
  const [newvalues, setNewValues] = React.useState({
    password: "",
    showNewPassword: false,
  });
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });
  

  const handleClickShowCurrentPassword = () => {
    setCurrentValues({ ...currentvalues, showCurrentPassword: !currentvalues.showCurrentPassword });
  };
  const handleMouseDownCurrentPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowNewPassword = () => {
    setNewValues({ ...newvalues, showNewPassword: !newvalues.showNewPassword });
  };
  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function changePassword(e){
    console.log("match",formState.matchPassword)
    console.log("new pass",formState.newPassword)
    
    if (formState.matchPassword !==formState.newPassword) {
      e.preventDefault();
      var msg = 'Password doesn`t match,please try again';
      updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }));
      setTimeout(() => {
        updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
      }, 2000);
    }
    else
    {
      
      const { oldPassword, newPassword } = formState;
      Auth.currentAuthenticatedUser()
      .then(user => {
          return Auth.changePassword(user,oldPassword,newPassword);
      })
      .then(data => {
        updateFormState(() => ({ ...formState, formType: 'newPassword' }));
        var msg = 'Password Changed Successfully';
        updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'success', msg: msg }));
        setTimeout(() => {
          updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
        }, 3000);
      })
      .catch(err => console.log(err));
      
    }




    

  }

  function onChange(e) {
    e.persist();
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
    // if (e.target.name === 'oldPassword') {
    //   var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    //   if (e.target.value.match(paswd)) {
    //     setPasswordValidity(false);
    //   }
    //   else {
    //     setPasswordValidity(true);
    //   }
    // }
   

    if (e.target.name === 'matchPassword') {
        var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if (e.target.value.match(paswd)) {
            
            setPasswordValidity(false);
        }
        else {
            
            setPasswordValidity(true);
        }
      }
      if (e.target.name === 'newPassword') {
        var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if (e.target.value.match(paswd)) {
          setcnfPasswordValidity(false);
        }
        else {
          
          setcnfPasswordValidity(true);
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
                                <div className="col-lg-12 pb-2">
                                    <Form.Label className="mb-0 f-14">Current Password</Form.Label>
                                    <FormControl name='oldPassword' maxLength={15} type={currentvalues.showCurrentPassword ? "text" : "password"} onChange={onChange}/>
                                    <i className="toggle-password" onClick={handleClickShowCurrentPassword}
                                    onMouseDown={handleMouseDownCurrentPassword}>{currentvalues.showCurrentPassword ? <Visibility /> : <VisibilityOff />}</i>
                                </div>

                                <div className="col-lg-12 pb-2">
                                    <Form.Label className="mb-0 f-14">New password</Form.Label>
                                    <FormControl name='matchPassword' maxLength={15} required isInvalid={passwordValidity}  id="new_password"  type={newvalues.showNewPassword ? "text" : "password"} onChange={onChange}/>
                                    <i className="toggle-password" onClick={handleClickShowNewPassword}
                                    onMouseDown={handleMouseDownNewPassword}>{newvalues.showNewPassword ? <Visibility /> : <VisibilityOff />}</i>
                                    <Form.Control.Feedback type="invalid" className="text-left f-13">
                                        Password between 7 to 15 characters which contain at least one numeric digit and a special character.
                                    </Form.Control.Feedback>
                                </div>
                                <div className="col-lg-12 pb-2">
                                    <Form.Label className="mb-0 f-14">Confirm password</Form.Label>
                                    <FormControl name='newPassword' maxLength={15} required  isInvalid={cnfpasswordValidity} id="cnf_password"  type={values.showPassword ? "text" : "password"} onChange={onChange}/>
                                    <i className="toggle-password" onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}>{values.showPassword ? <Visibility /> : <VisibilityOff />}</i>
                                    <Form.Control.Feedback type="invalid" className="text-left f-13">
                                        Password between 7 to 15 characters which contain at least one numeric digit and a special character.
                                    </Form.Control.Feedback>
                                </div>
                                <div className="col-lg-12 pt-3">
                                    <Button className='btn-blue float-right f-14' type="submit" onClick={changePassword}>Change Password</Button>
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
