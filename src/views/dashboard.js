import Layout from "../components/Layout";
import * as Highcharts from 'highcharts';
import { Breadcrumb, Container } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Moment from 'moment';
import { useNavigate } from "react-router-dom";
import configData from "../config/index.json"
import HighchartsReact from 'highcharts-react-official';
import Footer from "../components/Footer/Footer";

const pageData = { case_completed_date: [], case_completed_count: [] };

function Dashboard(props) {
  const [pageState, updatePageState] = useState(pageData);
  const client_id = props.clientid;
  const navigate = useNavigate();

  function RedirectToReport() {
    navigate('/reportDownload', { replace: true });
  }

  useEffect(() => {
    loadData()
  }, []);

  function loadData() {
    let url = configData.express_url;
    const postData = { client_id: client_id };
    axios.post(url + 'graphDashboard/GetGraphData', postData).then((res) => {
      let completed_date = [];
      let completed_count = [];
      res.data.forEach(graphdata => {
        completed_date.push(Moment(graphdata.case_completed_date).format("DD/MM/YYYY"));
        completed_count.push(graphdata.completed_case_count)
      });
      updatePageState(() => ({ ...pageState, case_completed_date: completed_date, case_completed_count: completed_count }))
    })

  }

  const { case_completed_date, case_completed_count } = pageState;

  const Config = {
    title: {
      text: 'Completed Cases'
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
        name: 'Case completed',
        data: case_completed_count,
        showInLegend: false,
      }
    ],
  };


  return (
      <>
        <Layout />
        <div className="container-fluid body-container mt-70 pt-2">
          <Container fluid className="my-3" onClick={RedirectToReport}>
            <Container fluid className="py-3 bg-white shadow-sm">
              <Breadcrumb>
                <Breadcrumb.Item><i className="mdi mdi-home"/> Dashboard</Breadcrumb.Item>
              </Breadcrumb>
            </Container>
            <HighchartsReact highcharts={Highcharts}
                             options={Config}/>
          </Container>
        </div>
        <Footer/>
      </>
  )
}

export default Dashboard;
