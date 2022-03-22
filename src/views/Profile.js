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
  Accordion,
} from "react-bootstrap";
import React, { useState, Component,useEffect } from "react";
import axios from "axios";
import configData from "../config/index.json";
import Moment from "moment";
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
        <br></br>
        <Container className="shadow">
          {/* <h3>Profile</h3> */}
          <br></br>
          <Row>
            <Col className="col-xl-4">
              <Card className="overflow-hidden shadow">
                {/* <Card.Img variant="top" src="/src/components/images/avator-1.jpg" /> */}

                {/* <Card.Title>Personal Information</Card.Title> */}
                {/* <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text> */}

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
                      {/* <tr>
                        <th scope="row">Location :</th>
                        <td>{this.state.apiResponse.client_name}</td>
                      </tr> */}
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
                      </Row>
          <br></br>
        </Container>
        <Footer/>
      </>
    );

}

export default Profile;
