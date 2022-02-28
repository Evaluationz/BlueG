import Layout from "../components/Layout";
import * as Highcharts from 'highcharts';
import {Breadcrumb, Container} from "react-bootstrap";
import React from "react";
import HighchartsReact from 'highcharts-react-official';



var getDaysArray = function(year, month) {
  var year=2022;
  var month=2;
  var monthIndex = month - 1; // 0..11 instead of 1..12
  var names = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];
  var date = new Date(year, monthIndex, 1);
  var result = [];
  while (date.getMonth() == monthIndex) {
    result.push(date.getDate());
    date.setDate(date.getDate() + 1);
  }
  return result;
}

const options = {
  title: {
    text: 'My chart'
  },
  xAxis: {
    categories: [getDaysArray()],
  },
  series: [
    { data: [1, 2, 3,4,5,6] }
  ],

} 

const noPureConfig = {
  xAxis: {
    categories: ["Se1", "Se2", "Se3", "Se4", "Se5"]
  },
  series: [
    {
      data: [20, 4, 12, 54, 44]
    }
  ]
};


function Dashboard() { 
    return (
      <>
      <Layout/>
      
              <Container className="d-flex justify-content-md-top align-items-center login-card-block my-5">
              
      <HighchartsReact
    highcharts={Highcharts}
    options={noPureConfig}
  />
  
  </Container>
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
