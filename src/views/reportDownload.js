import Layout from "../components/Layout";
import { Button, Alert, Container, Form, Row, Col, Breadcrumb } from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Moment from 'moment';
import { ImDownload3 } from "react-icons/im";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import configData from "../config/index.json"
import Footer from "../components/Footer/Footer";

const pageData = { ReportData: [],resumeID:'', startDate: Moment().startOf('month').format('YYYY-MM-DD'), endDate: Moment().format('YYYY-MM-DD') };

const alertSettings = {
  variant: '', msg: '', alertStatus: false
};

function ReportDownload(props) {

  const [pageState, updatePageState] = useState(pageData);
  const [alertState, updateAlertState] = useState(alertSettings);
  const client_id = props.clientid;

  useEffect(() => {
    loadData()
  }, []);

  function handleChange(e) {
    updatePageState(() => ({ ...pageState, [e.target.name]: e.target.value }))
  }

  const { alertStatus, variant, msg } = alertState;

  function getData(e) {
    e.preventDefault();
    loadData()

  };

  function loadData(e) {
    const { startDate, endDate,resumeID } = pageState;
    let url = configData.express_url;
    const postData = { from_date: startDate, to_date: endDate, client_id: client_id,resumeID:resumeID };
    axios.post(url + "report/GetReportData", postData)
        .then(res => {
          updatePageState(() => ({ ...pageState, ReportData: res.data }))
        })
  }

  function getReport(row) {
    let url = configData.express_url;
    let postData = { case_no: row.case_id };
    axios.post(url + "report/DownloadReportData", postData,
        { responseType: 'blob' })
        .then((res) => {
          const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
          let url = window.URL.createObjectURL(pdfBlob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'FinalReport.pdf';
          a.click();
        }).catch(err => {
      let msg = 'Final report not avaliable to download.';
      updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }));
      setTimeout(() => {
        updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))

      }, 3000);

    });
  }
  const { ReportData, startDate, endDate } = pageState;

  const columns = [{
    dataField: "SI No",
    text: "#",
    formatter: (cell, row, rowIndex, formatExtraData) => {
      return rowIndex + 1;
    },
  },
    {
      dataField: "resume_id",
      text: "Resume Id",
      // filter: textFilter(),
    },
    {
      dataField: "candidate_name",
      text: "Candidate"
    },
    {
      dataField: "client_name",
      text: "Client",
      sort: true
    },
    {
      dataField: "subclient_name",
      text: "SubClient"
    },
    {
      dataField: "profile_desc",
      text: "Profile"
    },
    {
      dataField: "submission_date",
      text: "Submission Date"
    },
    {
      dataField: "completion_date",
      text: "Completion Date"
    },
    {
      dataField: "",
      text: "Download Report",
      formatter: (cellContent, row) => {
        return (
            <div>
              <Button onClick={() => getReport(row)}><ImDownload3 /></Button>
            </div>
        );
      }
    }
  ];
  return (
      <>
        <Layout />
        <div className="container-fluid body-container mt-70 pt-2">
          <Container fluid className="my-3">
            <Container fluid className="py-3 bg-white shadow-sm">
              <Breadcrumb>
                <Breadcrumb.Item href="/dashboard"><i className="mdi mdi-home" />Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Reports</Breadcrumb.Item>
              </Breadcrumb>

              <Container fluid className="px-0">
                <Alert show={alertStatus} variant={variant}>{msg}</Alert>
                <Form method="POST">
                  <Form.Group as={Row} className="mb-12" controlId="formPlaintextEmail">
                    <Col sm="3">
                      <Form.Label column className="pb-0 f-14">From Date</Form.Label>
                      <Form.Control type="date" name="startDate" value={startDate} onChange={handleChange} className="f-14"/>
                    </Col>

                    <Col sm="3">
                      <Form.Label column className="pb-0 f-14">To Date</Form.Label>
                      <Form.Control type="date" name="endDate" value={endDate} onChange={handleChange} className="f-14"/>
                    </Col>

                    <Col sm="4">
                      <Form.Label column className="pb-0 f-14">Resume Id</Form.Label>
                      <Form.Control type="search" name="resumeID" onChange={handleChange} className="f-14"/>
                    </Col>

                    <Col sm="2" className="mt-4 pt-1" style={{ textAlign: 'right' }}>
                      <Form.Label column/>
                      <Button type="Submit" variant="primary" onClick={getData} className="btn-blue f-14">Search</Button>
                    </Col>
                  </Form.Group>
                </Form>
              </Container>

              <Container fluid className="px-0 mt-3">
                <BootstrapTable keyField="case_id"
                                data={ReportData}
                                columns={columns}
                                striped={false}
                                hover
                                condensed
                                pagination={paginationFactory()}
                                filter={filterFactory()}>
                </BootstrapTable>
              </Container>
            </Container>
          </Container>
        </div>
        <Footer/>
      </>
  );
}


export default ReportDownload;
