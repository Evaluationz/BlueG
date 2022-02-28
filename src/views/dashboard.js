import Layout from "../components/Layout";
import * as Highcharts from 'highcharts';
import { Breadcrumb, Container } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Moment from 'moment';
import { Routes, Link,useHistory,BrowserRouter as Router,Switch,Route,Redirect, } from "react-router-dom";
import ReportDownload from "./reportDownload";
import HighchartsReact from 'highcharts-react-official';


const pageData={case_completed_date:[],case_completed_count:[]}



function Dashboard() {
  const [ pageState, updatePageState ] = useState(pageData);

  function RedirectToReport()
  {
  alert("hii");
  
<Route exact path="/" render={() => (

    <ReportDownload/>
  
)}/>

  // <Router>
  
   
  // <Route path="ReportDownload" component={ReportDownload} />
      
  //     </Router>
  }

  useEffect(() => {
    axios.post('http://localhost:306/graphDashboard/GetGraphData', {
      client_id: 212,
    }).then((res) => {
      let completed_date=[];
      let completed_count=[]
      res.data.forEach(graphdata => {
        console.log("inside for", graphdata.case_completed_date)
        completed_date.push(Moment(graphdata.case_completed_date).format("DD/MM/YYYY"))
        completed_count.push(graphdata.completed_case_count)
      });
     updatePageState(() => ({...pageState,case_completed_date:completed_date,case_completed_count:completed_count}))
    })
  }, []);



const {case_completed_date,case_completed_count}=pageState

  const Config = {
    title: {
      text: 'Completed Case Graph'
    },
    xAxis: {
      categories: case_completed_date,
      
  
  
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Completed Cases'
      }
    },
    series: [
      {
        data: case_completed_count
      }
    ]
  };

  
  return (
    <>
      <Layout />
      <div className="container-fluid body-container" >
        <Container fluid className="my-3" onClick={RedirectToReport}>
          <Container fluid className="py-3 bg-white shadow-sm" >
            <Breadcrumb>
              <Breadcrumb.Item><i className="mdi mdi-home" /> Dashboard</Breadcrumb.Item>
            </Breadcrumb>

          </Container>
          <HighchartsReact
            highcharts={Highcharts}
            options={Config}
          />
        </Container>
      </div>
    </>
  )
}

export default Dashboard;
