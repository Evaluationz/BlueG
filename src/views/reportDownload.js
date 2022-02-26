import Layout from "../components/Layout";
import {Button, Table, Container, Form, Row, Col, Breadcrumb} from 'react-bootstrap';
import React, { useState, Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ImDownload3 } from "react-icons/im";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

class ReportDownload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiResponse: [],
      startDate: '',
      endDate: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getData = (e) => {
    e.preventDefault();
    const { startDate, endDate } = this.state;
    console.log("Im here", startDate, endDate);
    axios.post("http://localhost:306/report/GetReportData", {
      from_date: startDate,
      to_date: endDate,
      client_id: 212
    })
      .then(res => {
        this.setState({ apiResponse: res.data });
        console.log("result", res)
      })
  };

  getReport = (row) => {
    console.log("hii", row.case_id);
    axios.post("http://localhost:306/report/DownloadReportData", {
      case_no: row.case_id,
    },
      { responseType: 'blob' })
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(pdfBlob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'FinalReport.pdf';
        a.click();
      });

  };

  componentDidMount() {
    // this.callAPI();
  }
  render() {
    const { startDate, endDate } = this.state;
    const date = new Date();
    date.setDate(date.getDate());
    var date_d = date.toISOString().substr(0, 10);
    const defaultdate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    const columns = [{
      dataField: "SI No",
      text: "SI NO",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return rowIndex + 1;
      },
    },
    {
      dataField: "resume_id",
      text: "Resume Id",
      filter: textFilter(),
    },
    {
      dataField: "candidate_name",
      text: "Candidate Name"
    },
    {
      dataField: "client_name",
      text: "Client Name",
      sort: true

    },
    {
      dataField: "subclient_name",
      text: "SubClient Name"
    },
    {
      dataField: "profile_desc",
      text: "Profile"
    },
    {
      dataField: "submission_date",
      text: "Submission date"
    },
    {
      dataField: "completion_date",
      text: "Completion date"
    },
    {
      dataField: "",
      text: "Download Report",
      formatter: (cellContent, row) => {
        return (
          <div >

            <button type="button" onClick={() => this.getReport(row)}><ImDownload3 /></button>

          </div>
        );
      }

    }
    ];
    return (
      <>
        <Layout />
        <div className="container-fluid body-container">
          <Container fluid className="my-3">
            <Container fluid className="py-3 bg-white shadow-sm">
              <Breadcrumb>
                <Breadcrumb.Item href="/dashboard"><i className="mdi mdi-home"/>Home</Breadcrumb.Item>

                <Breadcrumb.Item active>Reports</Breadcrumb.Item>
              </Breadcrumb>

              <Container fluid className="px-0">
                <Form method="POST">
                  <Form.Group as={Row} className="mb-12" controlId="formPlaintextEmail">
                    <Col sm="4">
                      <Form.Label column>From Date</Form.Label>
                      <Form.Control type="date" name="startDate" onChange={this.handleChange} />
                    </Col>

                    <Col sm="4">
                      <Form.Label column>To Date</Form.Label>
                      <Form.Control type="date" name="endDate" onChange={this.handleChange} />
                    </Col>
                    <Col sm="4" className="mt-4 pt-2" style={{textAlign: 'right'}}>
                      <Form.Label column></Form.Label>
                      <Button type="Submit" variant="primary" onClick={this.getData}>Search</Button>
                    </Col>
                  </Form.Group>
                </Form>
              </Container>

              <br/>

              <BootstrapTable keyField="case_id"
                              data={this.state.apiResponse}
                              columns={columns}
                              striped
                              hover
                              condensed
                              pagination={paginationFactory()}
                              filter={filterFactory()}>
              </BootstrapTable>
            </Container>
          </Container>
        </div>
      </>
    );
  }
}

export default ReportDownload;
