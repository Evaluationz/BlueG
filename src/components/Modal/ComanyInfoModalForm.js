import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import configData from "../../config/index.json"
import { Form, Modal, Button, FormControl, Row, Col, Card, Alert } from 'react-bootstrap';
import Select from "@material-ui/core/Select";

const alertSettings = {
    variant: '', msg: '', alertStatus: false
};

const CompanyInfoModalForm = (props) => {
    const pageState = props.pageState.ReportData
    const [alertState, updateAlertState] = useState(alertSettings);
    const [formState, updateFormState] = useState(pageState);
    const { alertStatus, variant, msg } = alertState;

    async function updateCompanyInfo() {

        let url = configData.express_url;
        const postData = { address: formState.address, email: formState.email };

        axios.post(url + "bgProfile/UpdateCompanyInfo", postData)
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
        console.log("form state", formState)
    }

    return (
        <>
            <Alert show={alertStatus} variant={variant}>{msg}</Alert>
            <Row>
                <Col>
                    <Form onSubmit={updateCompanyInfo}>
                        <Form.Group className="mb-1">
                            <div className="row align-items-center ">
                                <div className="col-lg-12 pb-2">
                                    <Form.Label className="mb-0 f-14">Email</Form.Label>
                                    <FormControl name='email' required type='text' defaultValue={formState.email} readOnly={true} className="f-14"/>
                                </div>

                                <div className="col-lg-12 pb-2">
                                    <Form.Label className="mb-0 f-14">Address</Form.Label>
                                    <FormControl name='address' required type='text' defaultValue={formState.address} onChange={handleChange} className="f-14"/>
                                </div>

                                {/* <div className="col-md-4 pb-2">
                                    <Form.Label className="mb-0 f-14">City</Form.Label>
                                    <Form.Select name='city' className="f-14">
                                        <option>Select</option>
                                        <option>Bengaluru</option>
                                    </Form.Select>
                                </div>

                                <div className="col-md-4 pb-2">
                                    <Form.Label className="mb-0 f-14">ZIP</Form.Label>
                                    <Form.Select name='zip' className="f-14">
                                        <option>Select</option>
                                        <option>Zip code</option>
                                    </Form.Select>
                                </div>

                                <div className="col-md-4 pb-2">
                                    <Form.Label className="mb-0 f-14">Country</Form.Label>
                                    <Form.Select name='country' className="f-14">
                                        <option>Select</option>
                                        <option>India</option>
                                    </Form.Select>
                                </div>

                                <div className="col-md-4 pb-2">
                                    <Form.Label className="mb-0 f-14">Tier</Form.Label>
                                    <Form.Select name='tier' className="f-14">
                                        <option>Select</option>
                                        <option>Monthly</option>
                                    </Form.Select>
                                </div>

                                <div className="col-md-4 pb-2">
                                    <Form.Label className="mb-0 f-14">Valid Till</Form.Label>
                                    <Form.Control type="date" className="f-14"/>
                                </div> */}

                                <div className="col-lg-12 pt-3">
                                    <Button className='btn-blue float-right f-14' type="submit">Update</Button>
                                </div>
                            </div>
                        </Form.Group>
                    </Form>

                </Col>
            </Row>
        </>
    );
};


export default CompanyInfoModalForm;
