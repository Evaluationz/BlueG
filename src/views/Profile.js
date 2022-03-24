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
  Accordion, Breadcrumb, Alert,
} from "react-bootstrap";
import React, { useState, Component,useEffect } from "react";
import axios from "axios";
import configData from "../config/index.json";
import Moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import Footer from "../components/Footer/Footer";
const pageData = { ReportData: [], startDate: Moment().startOf('month').format('YYYY-MM-DD'), endDate: Moment().format('YYYY-MM-DD') }

function Profile(props) {
  const [pageState, updatePageState] = useState(pageData);
  const client_id = props.clientid;
//  this.state = {
//       apiResponse: [],
//       startDate: "",
//       endDate: "",
//     };
   useEffect(() => {
    loadData()
   }, [])
    function handleChange(e) {
      updatePageState(() => ({
        ...pageState,
        [e.target.name]: e.target.value,
      }));
    }
 function loadData() {

      axios
        .get(configData.express_url + "bgProfile/GetUserProfile/" + client_id)
        .then((res) => {
          //this.setState({ apiResponse: res.data[0] });
            updatePageState(() => ({ ...pageState, ReportData: res.data[0] }));
          console.log("result", res.data[0]);
        });
      } 
  
    return (
      <>
        <Layout />
        <div className="container-fluid body-container mt-70 pt-2">
          <Container fluid className="py-3">
           
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
                    <div className="card-header"></div>
                    <div className="card-body text-center">
                      <div className="profile-img-block">
                        <img src="./images/user.png" className="card-profile-img"/>

                        <a className="edit-camera-icon">
                          <i className="mdi mdi-camera cursor-pointer"></i>
                        </a>
                      </div>

                      <h4 className="mb-1">{pageState.ReportData.client_name}</h4>
                      <p className="mb-1">Bangalore</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title border-bottom pb-2 text-left">Basic Information <i className="mdi mdi-pencil edit-profile cursor-pointer"></i></h5>
                      <div className="row">
                        {/*<div className="col-md-12">
                          <div className="text-left mb-1">
                            <h6 className="mb-1">About Me</h6>
                            <p className="f-14">About Me section</p>
                          </div>
                        </div>*/}
                        <div className="col-md-6">
                          <div className="text-left mb-1">
                            <h6 className="mb-1">Name</h6>
                          <p className="f-14">{pageState.ReportData.client_name}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="text-left mb-1">
                            <h6 className="mb-1">Email</h6>
                            <p className="f-14">{pageState.ReportData.email}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="text-left mb-1">
                            <h6 className="mb-1">Contact Number</h6>
                            <p className="mb-1 f-14">{pageState.ReportData.contact_no}</p>
                          </div>
                        </div>

                        <div className="col-md-12 border-top pt-3 mt-2">
                          <div className="text-left mb-1">
                            <h6 className="mb-0">Change Password <i className="mdi mdi-pencil edit-profile cursor-pointer"></i></h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title border-bottom pb-2 text-left">Company Information <i className="mdi mdi-pencil edit-profile cursor-pointer"></i></h5>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="text-left mb-1">
                            <h6 className="mb-1">Company Name</h6>
                          <p className="f-14">{pageState.ReportData.client_name}</p>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="text-left mb-1">
                            <h6 className="mb-1">Address</h6>
                            <p className="f-14">{pageState.ReportData.address}</p>
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-4">
                          <div className="text-left mb-1">
                            <h6 className="mb-1">City</h6>
                            <p className="f-14">{pageState.ReportData.address}</p>
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-4">
                          <div className="text-left mb-1">
                            <h6 className="mb-1">ZIP</h6>
                            <p className="f-14">560064</p>
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-4">
                          <div className="text-left mb-1">
                            <h6 className="mb-1">Country</h6>
                            <p className="f-14">India</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="text-left mb-1">
                            <h6 className="mb-1">Tier</h6>
                            <p className="mb-1 f-14">Monthly</p>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="text-left mb-1">
                            <h6 className="mb-1">Valid Till</h6>
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
        <Footer/>
      </>
    );

}

export default Profile;
