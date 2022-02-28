import Layout from "../components/Layout";
import {Button,Alert, Container, Form, Row, Col, Breadcrumb} from 'react-bootstrap';
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

const pageData = { ReportData:[],startDate: Moment().startOf('month').format('YYYY-MM-DD'),endDate:Moment().format('YYYY-MM-DD')}

const alertSettings = {
  variant:'' , msg:'' , alertStatus: false
}

function ReportDownload() {
  const [ pageState, updatePageState ] = useState(pageData);
  const [ alertState, updateAlertState ] = useState(alertSettings);

  useEffect(() => {
    loadData()
  },[])

  function handleChange(e) {
    updatePageState(() => ({...pageState,[e.target.name]:e.target.value}))
  }

  const { alertStatus,variant,msg } = alertState;

  function getData(e){
    e.preventDefault();
    loadData()
  };

  function loadData(){
    const { startDate, endDate } = pageState;
    let url = configData.express_url
    const postData = { from_date: startDate,to_date: endDate,client_id: 213}
    axios.post(url+"report/GetReportData",postData)
      .then(res => {
        updatePageState(() => ({...pageState,ReportData:res.data}))
      })
  }

  function getReport(row) {
    let url = configData.express_url
    let postData = { case_no: row.case_id}
    axios.post(url+"report/DownloadReportData",postData,
      { responseType: 'blob' })
      .then((res) => {
      console.log("res",res)
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(pdfBlob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'FinalReport.pdf';
        a.click();
      }).catch(err => {
        console.log(err,"sorry");
        let msg = 'Final report not avaliable to download.'
        updateAlertState(() => ({...alertState,alertStatus:true,variant:'danger',msg:msg}))
     });
  }
    const { ReportData,startDate,endDate }= pageState;

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
          <div>
            <Button onClick={()=>getReport(row)}><ImDownload3 /></Button>
          </div>
        );
      }

    }
    ];
    return (
      <>
        <Layout />
        <div className="container-fluid body-container">
        <Alert show={alertStatus} variant={variant}>{msg}</Alert>
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
                      <Form.Control type="date" name="startDate" value={startDate} onChange={handleChange} />
                    </Col>

                    <Col sm="4">
                      <Form.Label column>To Date</Form.Label>
                      <Form.Control type="date" name="endDate" value={endDate} onChange={handleChange} />
                    </Col>
                    <Col sm="4" className="mt-4 pt-2" style={{textAlign: 'right'}}>
                      <Form.Label column></Form.Label>
                      <Button type="Submit" variant="primary" onClick={getData}>Search</Button>
                    </Col>
                  </Form.Group>
                </Form>
              </Container>

              <br/>

              <BootstrapTable keyField="case_id"
                              data={ReportData}
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


export default ReportDownload;
