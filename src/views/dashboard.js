import Layout from "../components/Layout";
import * as Highcharts from 'highcharts';
import { Breadcrumb, Container } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import HighchartsReact from 'highcharts-react-official';


var getDaysArray = function (year, month) {
  var year = 2022;
  var month = 2;
  var monthIndex = month - 1; // 0..11 instead of 1..12
  var names = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var date = new Date(year, monthIndex, 1);
  var result = [];
  while (date.getMonth() == monthIndex) {
    result.push(date.getDate());
    date.setDate(date.getDate() + 1);
  }
  return result;
}





const noPureConfig = {
  title: {
    text: 'Completed Case Graph'
  },
  xAxis: {
    categories: ["1", "2", "3", "4", "5"],
    title: {
      text: 'Dates'
    }


  },
  yAxis: {
    min: 0,
    title: {
      text: 'Total Completed Cases'
    }
  },
  series: [
    {
      data: [20, 4, 12, 54, 44]
    }
  ]
};


function Dashboard() {

  useEffect(() => {
    axios.post('http://localhost:306/graphDashboard/GetGraphData', {
      client_id: 212,
    }).then((res) => {
      console.log("first index", res.data)
    })
  }, []);

  return (
    <>
      <Layout />
      <div className="container-fluid body-container">
        <Container fluid className="my-3">
          <Container fluid className="py-3 bg-white shadow-sm">
            <Breadcrumb>
              <Breadcrumb.Item><i className="mdi mdi-home" /> Dashboard</Breadcrumb.Item>
            </Breadcrumb>

          </Container>
          <HighchartsReact
            highcharts={Highcharts}
            options={noPureConfig}
          />
        </Container>
      </div>
    </>
  )
}

export default Dashboard;
