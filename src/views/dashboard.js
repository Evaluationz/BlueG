import Layout from "../components/Layout";
import {Breadcrumb, Container} from "react-bootstrap";
import React from "react";

function Dashboard() { 
    return (
      <>
      <Layout/>
          <div className="container-fluid body-container">
              <Container fluid className="my-3">
                  <Container fluid className="py-3 bg-white shadow-sm">
                      <Breadcrumb>
                          <Breadcrumb.Item><i className="mdi mdi-home"/> Dashboard</Breadcrumb.Item>
                      </Breadcrumb>
                  </Container>
              </Container>
          </div>
      </>
    )
}

export default Dashboard;
