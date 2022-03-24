import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { Form, Modal, Button, FormControl, Row, Col, Card } from 'react-bootstrap';



const BasicinfoModalForm = (props,{ onSubmit }) => {
    const { pageState } = props

    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    return (
        <Row>
            <Col>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-1">
                        <div className="row align-items-center ">
                            <div className="col-lg-12 pb-3">
                                <Form.Label className="mb-0">Email Id</Form.Label>
                                <FormControl name='email' type='email' required placeholder="Email id" value={pageState.ReportData.client_name} />
                            </div>
                            <div className="col-lg-12 pb-1">
                                <Form.Label className="mb-0">Name</Form.Label>
                                <FormControl name='name' required type='text' placeholder="Name" />
                            </div>
                            <div className="col-lg-12 pb-1">
                                <Form.Label className="mb-0">Contact Number</Form.Label>
                                <FormControl name='contactno' required type='number' placeholder="Contact Number" />
                            </div>
                            <div className="col-lg-12 py-3">
                                <Button className='btn-blue' type="submit"  >Update</Button>
                            </div>
                        </div>
                    </Form.Group>
                </Form>

            </Col>
        </Row>

    );
};







// import React, { useEffect, useState } from 'react';
// import { Routes, Route } from "react-router-dom";
// import { Form, Modal, Button, FormControl, Row, Col, Card } from 'react-bootstrap';


// function BasicinfoModal(props) {
//     const [show, setBasicmodal] =props;
//      const handleClose = () => setBasicmodal(false);
//      const handleShow = () => setBasicmodal(true);

//     return (
//         <>
//             <Modal show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Modal heading</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Row>
//                         <Col>
//                             <Card border="light" className='shadow rounded password-card'>
//                                 <Card.Body>
//                                     <Form.Group className="mb-1">
//                                         <div className="row align-items-center ">
//                                             <div className="col-lg-12 pb-3">
//                                                 <Form.Label className="mb-0">Email Id</Form.Label>
//                                                 <FormControl name='email' type='email' required placeholder="Email id" />
//                                             </div>
//                                             <div className="col-lg-12 pb-1">
//                                                 <Form.Label className="mb-0">Name</Form.Label>
//                                                 <FormControl name='name' required type='text' placeholder="Name" />
//                                             </div>
//                                             <div className="col-lg-12 pb-1">
//                                                 <Form.Label className="mb-0">Contact Number</Form.Label>
//                                                 <FormControl name='contactno' required type='number' placeholder="Contact Number" />
//                                             </div>
//                                             <div className="col-lg-12 py-3">
//                                                 <Button variant="primary" type="submit"  >Submit</Button>
//                                             </div>
//                                         </div>
//                                     </Form.Group>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleClose}>
//                         Close
//                     </Button>
//                     <Button variant="primary" onClick={handleClose}>
//                         Save Changes
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// }

export default BasicinfoModalForm;