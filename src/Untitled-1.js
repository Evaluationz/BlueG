
  class ReportView extends Component
  {
    //const [startDate, setStartDate] = useState(new Date());
     constructor(props)
     {
         super(props);

         var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        
         this.state={apiResponse:[],
          startDate:'',
          endDate:'',
          date:date
          //count:1
         
        };
     } 
     

     handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
    }

    getData =(e)=>{
      e.preventDefault();
      const {startDate,endDate}=this.state
      console.log("Im here",startDate,endDate)
      axios.post("http://localhost:306/report/GetReportData",{
       from_date:startDate,
       to_date:endDate 
      })
      .then(res=>{
          this.setState({apiResponse:res.data})
          console.log("result",res)
         })
      
   
     
    }

    //  callAPI(){
    //   // this.setState(prevState => {
    //   //   if (prevState.apiResponse.count > 0) {
    //   //     return {
    //   //       count: prevState.apiResponse.count + 1
    //   //     }
    //   //   } else {
    //   //     return null;
    //   //   }
    //   // });

    //      axios.get("http://localhost:306/report/GetReportData")
    //      .then(res=>{
    //          this.setState({apiResponse:res.data})
    //          console.log("result",res)
    //         })
         
      
        
    //  }
      getReport(case_id)       {
        //alert("Hii");
        console.log("hii",case_id)
      
       }
     
   

    //  renderTableRows =() =>{
    //    return this.state.apiResponse.map(apiResponses=>{
    //      return (
    //        <tr key={apiResponses.case_id}>
    //          <td></td>
    //          <td>{apiResponses.resume_id}</td>
    //          <td>{apiResponses.candidate_name}</td>
    //          <td>{apiResponses.client_name}</td>
    //          <td>{apiResponses.subclient_name}</td>
    //          <td>{apiResponses.profile_desc}</td>
    //          <td>{apiResponses.submission_date}</td>
    //          <td>{apiResponses.completion_date}</td>
    //          <td><button type="button" onClick={() => this.getReport(apiResponses.case_id)}><ImDownload3/></button></td>
    //        </tr>
    //      )
    //    })

    //  }
     componentDidMount()
     {
        // this.callAPI();
         
     }
     render()
     {
      const { startDate, endDate } = this.state;
      // const date=new Date();
      // const defaultdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
     
         return(
          <>
          <Layout/>
          <div style={{ 
                      width: 1600, padding:30 }}>
                     
                             
     <Container className="p-5 mb-4 bg-light rounded-3" >
      <Form method="POST" >
      <Form.Group as={Row} className="mb-12" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          From Date
        </Form.Label>
         <Col sm="2">
        <Form.Control type="date" name="startDate" defaultValue={this.state.date} onChange={this.handleChange} />
        </Col>
        <Form.Label column sm="3">
          To Date
        </Form.Label>
        <Col sm="2">
          <Form.Control type="date" name="endDate" onChange={this.handleChange} />
        </Col>
        <Col sm="3">
        <Button type="Submit" variant="primary" onClick={this.getData}>Search</Button>
        </Col>
      </Form.Group>
    </Form>
      <br/><br/>  
      <Table striped bordered hover>
  <thead>
  <th>SI No</th>
  <th>Resume Id</th>
  <th>Candidate</th>
  <th>Client</th>
  <th>Sub client</th>
  <th>Profile</th>
  <th>Submission Date</th>
  <th>Completion Date</th>
  <th>Download Report</th>
  </thead>
  <tbody>

  <tr>
      <td>
          {this.renderTableRows()}
      </td>
  </tr>

   
  </tbody>
</Table>
    </Container>
    
    </div>
          </>

              
         
         );
     }
  }





