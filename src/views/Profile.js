import Layout from "../components/Layout";
import {
  Card,
  ListGroup,
  ListGroupItem,
  Container,
  Row,
  Form,
  Button,
  Col,
  Table,
  AccordionButton,
  Accordion, Breadcrumb, Alert, Modal
} from "react-bootstrap";
import React, { useState, Component, useEffect } from "react";
import axios from "axios";
import configData from "../config/index.json";
import Moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import Footer from "../components/Footer/Footer";
import BasicinfoModalForm from "../components/Modal/BasicinfoModalForm";
import CompanyInfoModalForm from "../components/Modal/ComanyInfoModalForm";
import ChangePasswordModalForm from "../components/Modal/ChangePasswordModalForm";

const pageData = { ReportData: [], startDate: Moment().startOf('month').format('YYYY-MM-DD'), endDate: Moment().format('YYYY-MM-DD') }

function Profile(props) {

  const [pageState, updatePageState] = useState(pageData);
  const [BasicInfoModalshow, setShowBasicInfo] = useState(false);
  const [BasicCompanyModalshow, setShowCompanyInfo] = useState(false);
  const [ChangePasswordModalshow, setShowChangePassword] = useState(false);

  const handleCloseBasicInfo = () => setShowBasicInfo(false);
  const handleShowBasicInfo = () => setShowBasicInfo(true);

  const handleCloseCompanyInfo = () => setShowCompanyInfo(false);
  const handleShowCompanyInfo = () => setShowCompanyInfo(true);

  const handleCloseChangePassword = () => setShowChangePassword(false);
  const handleShowChangePassword = () => setShowChangePassword(true);

  const clientemail = props.clientemail;
  console.log("client email",clientemail)
  //  this.state = {
  //       apiResponse: [],
  //       startDate: "",
  //       endDate: "",
  //     };
  useEffect(() => {
    loadData()
  }, [])


  // const setBasicmodal = (props) => {
  //   console.log("props", props)
  //   return <BasicinfoModal showModal={props} />
  // }

  function handleChange(e) {
    updatePageState(() => ({
      ...pageState,
      [e.target.name]: e.target.value,
    }));
  }
  function loadData() {
    let postData = { clientemail: clientemail };
    axios
      .post(configData.express_url + "bgProfile/GetUserProfile",postData)
      .then((res) => {
        //this.setState({ apiResponse: res.data[0] });
        updatePageState(() => ({ ...pageState, ReportData: res.data[0] }));
        console.log("result", res.data[0]);
      });
  }

  return (
    <>
      <Modal show={BasicInfoModalshow} onHide={handleCloseBasicInfo}>
        <Modal.Header closeButton>
          <Modal.Title className="f-20">Basic Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BasicinfoModalForm pageState={pageState} />
        </Modal.Body>
      </Modal>

      <Modal show={BasicCompanyModalshow} onHide={handleCloseCompanyInfo}>
        <Modal.Header closeButton>
          <Modal.Title className="f-20">Company Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CompanyInfoModalForm pageState={pageState}/>
        </Modal.Body>
      </Modal>

      <Modal show={ChangePasswordModalshow} onHide={handleCloseChangePassword}>
        <Modal.Header closeButton>
          <Modal.Title className="f-20">Change password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChangePasswordModalForm/>
        </Modal.Body>
      </Modal>

      <Layout />
      <div className="container-fluid body-container mt-70 pt-2">
        <Container fluid="true" className="py-3">

          {/*<Row>
                  <Col className="col-xl-4">
                    <Card className="overflow-hidden shadow">
                      <Card.Body>
                        <div className="user text-center">
                          <div className="profile">
                            <img
                                src="https://i.imgur.com/JgYD2nQ.jpg"
                                className="rounded-circle"
                                width="80"
                            />{" "}
                          </div>
                        </div>
                        <Table responsive className="table table-nowrap mb-0">
                          <tbody>
                          <tr>
                            <th scope="row">Name :</th>
                            <td>{pageState.ReportData.client_name}</td>
                          </tr>
                          <tr>
                            <th scope="row">Mobile :</th>
                            <td>{pageState.ReportData.contact_no}</td>
                          </tr>
                          <tr>
                            <th scope="row">E-mail :</th>
                            <td>{pageState.ReportData.email}</td>
                          </tr>
                           <tr>
                        <th scope="row">Location :</th>
                        <td>{this.state.apiResponse.client_name}</td>
                      </tr>
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col className="col-xl-8">
                    <Card className="shadow">
                      <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Basic Information</Accordion.Header>
                          <Accordion.Body>
                            <Form>
                              <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    value={pageState.ReportData.client_name}
                                />
                              </Form.Group>

                              <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="name@example.com"
                                    value={pageState.ReportData.email}
                                />
                              </Form.Group>
                              <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>Contact Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Contract Number"
                                    value={pageState.ReportData.contact_no}
                                />
                              </Form.Group>
                            </Form>
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                          <Accordion.Header>Company Details</Accordion.Header>
                          <Accordion.Body>
                            <Form>
                              <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>Company Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Company Name"
                                    value={pageState.ReportData.client_name}
                                />
                              </Form.Group>
                              <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Address"
                                    value={pageState.ReportData.address}
                                />
                              </Form.Group>
                              <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>Tier</Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    placeholder="Enter Tier"
                                />
                              </Form.Group>
                              <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>Valid Till</Form.Label>
                                <Form.Control readOnly type="date" />
                              </Form.Group>
                            </Form>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </Card>
                  </Col>
                </Row>*/}

          <div className="row">
            <div className="col-md-4">
              <div className="card card-profile">
                <div className="card-header border-0 shadow-none"> </div>
                <div className="card-body text-center">
                  <div className="profile-img-block">
                    <img src="./images/user.png" className="card-profile-img" />

                    {/*<a className="edit-camera-icon">
                      <i className="mdi mdi-camera cursor-pointer"></i>
                    </a>*/}
                  </div>

                  <h4 className="mb-1">{pageState.ReportData.client_name}</h4>
                  <p className="mb-1">Bangalore</p>
                </div>
              </div>
            </div>

            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title border-bottom pb-2 text-left">Basic Information <i className="mdi mdi-pencil edit-profile cursor-pointer" onClick={handleShowBasicInfo}></i></h5>
                  <div className="row">
                    {/* <div className="col-md-12">
                      <div className="text-left mb-1">
                        <h6 className="mb-0 f-14 font-bold">About Me</h6>
                        <p className="f-14">About Me section</p>
                      </div>
                    </div> */}
                    <div className="col-md-6">
                      <div className="text-left mb-1">
                        <p className="mb-0 f-14 font-bold">Name</p>
                        <p className="f-14">{pageState.ReportData.client_name}</p> 
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-left mb-1">
                        <p className="mb-0 f-14 font-bold">Email</p>
                        <p className="f-14">{pageState.ReportData.email}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-left mb-1">
                        <p className="mb-0 f-14 font-bold">Contact Number</p>
                        <p className="mb-1 f-14">{pageState.ReportData.contact_no}</p>
                      </div>
                    </div>
                    <div className="col-md-12 border-top pt-3 mt-2">
                      <div className="text-left mb-1">
                        <h6 className="mb-0">Change Password <i className="mdi mdi-pencil edit-profile cursor-pointer" onClick={handleShowChangePassword}></i></h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h5 className="card-title border-bottom pb-2 text-left">Company Information <i className="mdi mdi-pencil edit-profile cursor-pointer" onClick={handleShowCompanyInfo}></i></h5>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="text-left mb-1">
                        <p className="mb-0 f-14 font-bold">Company Name</p>
                        <p className="f-14">{pageState.ReportData.client_name}</p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="text-left mb-1">
                        <p className="mb-0 f-14 font-bold">Address</p>
                        <p className="f-14">{pageState.ReportData.address}</p>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-4">
                      <div className="text-left mb-1">
                        <p className="mb-0 f-14 font-bold">City</p>
                        <p className="f-14">Test</p>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-4">
                      <div className="text-left mb-1">
                        <p className="mb-0 f-14 font-bold">ZIP</p>
                        <p className="f-14">560064</p>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-4">
                      <div className="text-left mb-1">
                        <p className="mb-0 f-14 font-bold">Country</p>
                        <p className="f-14">India</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-left mb-1">
                        <p className="mb-0 f-14 font-bold">Tier</p>
                        <p className="mb-1 f-14">Monthly</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-left mb-1">
                        <p className="mb-0 f-14 font-bold">Valid Till</p>
                        <p className="mb-1 f-14">26-April-2022</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );

}

export default Profile;
