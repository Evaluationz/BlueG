import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import configData from "../../config/index.json"
import {Form, Modal, Button, FormControl, Row, Col, Card, Alert, Container, InputGroup} from 'react-bootstrap';


const alertSettings = {
    variant: '', msg: '', alertStatus: false
};
const BasicinfoModalForm = (props) => {
    const [alertState, updateAlertState] = useState(alertSettings);
    const pageState = props.pageState.ReportData

    const [formState, updateFormState] = useState(pageState);
    const { alertStatus, variant, msg } = alertState;
    async function updateBasicInfo() {

        let url = configData.express_url;
        const postData = { contactno: formState.contact_no, email: formState.email, name: formState.client_name };
        axios.post(url + "bgProfile/UpdateBasicInfo", postData)
            .then(res => {
                var msg = 'Update Successfully';
                updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'success', msg: msg }));
                setTimeout(() => {
                    updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
                }, 3000);
            })
    }



    function handleChange(e) {
        updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
    }

    return (
        <>
            <div>
                <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                <Row>
                    <Col>
                        <Form onSubmit={updateBasicInfo}>
                            <Form.Group className="mb-1">
                                <div className="row align-items-center ">
                                    <div className="col-lg-12 pb-2">
                                        <Form.Label className="mb-0 f-14">Email</Form.Label>
                                        <FormControl name='email' required type='text' defaultValue={formState.email} readOnly={true} className="f-14"/>
                                    </div>
                                    <div className="col-lg-12 pb-2">
                                        <Form.Label className="mb-0 f-14">Name</Form.Label>
                                        <FormControl name='client_name' required type='text' defaultValue={formState.client_name} placeholder="Name" onChange={handleChange} className="f-14"/>
                                    </div>
                                    <div className="col-lg-12 pb-2">
                                        <Form.Label className="mb-0 f-14">Contact Number</Form.Label>
                                        <InputGroup className="p-0">
                                            <InputGroup.Text id="basic-addon1" className="shadow-none f-12">+91</InputGroup.Text>
                                            <FormControl name='contact_no' required type='number' defaultValue={formState.contact_no} onChange={handleChange} className="f-14"/>
                                        </InputGroup>
                                    </div>
                                    <div className="col-lg-12 pt-3">
                                        <Button className='btn-blue float-right f-14' type="submit">Update</Button>
                                    </div>
                                </div>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    );
};


export default BasicinfoModalForm;
