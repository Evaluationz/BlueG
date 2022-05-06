import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import SignUp from "./views/Signup/singnUp"
import Login from "./views/Login/signIn"
import Dashboard from "./views/Dashboard/dashboard.js";
import ReportDownload from "./views/Reports/reportDownload.js";
import Profile from "./views/Profile/Profile.js";
import Loader from "./components/Loader";

import './styles.scss';

import { Auth, Hub } from 'aws-amplify';



function App() {
  const [formType, updateFormState] = useState('singIn');
  const [user, updateUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    checkUser()
  }, []);
  
  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      if (user) {
        updateUser(user)
        updateFormState('confirmSingIn')
      }
    } catch (err) {
      updateUser(null)
    }
  }

  
  // async function setAuthListener() {
  //   var msg = '';
  //   Hub.listen('auth', (data) => {
  //     switch (data.payload.event) {
  //       case 'signIn_failure':
  //         msg = data.payload.data.message
  //         updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'danger', msg: msg }))
  //         setTimeout(() => {
  //           updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
  //         }, 3000);
  //         setValidatedSignIn(false);
  //         break;
  //       case 'configured':
  //         msg = data.payload.data.message
  //         updateAlertState(() => ({ ...alertState, alertStatus: true, variant: 'success', msg: msg }))
  //         setTimeout(() => {
  //           updateAlertState(() => ({ ...alertState, alertStatus: false, variant: '', msg: '' }))
  //         }, 3000);
  //     }
  //   });
  // }
  return (
    <>
      {loading === false ? (
        <div className="App">
          {
            formType === 'signUp' && (
             <SignUp stateChanger={updateFormState}/>
            )
          }
          {
            formType === 'singIn' && (
             <Login stateChanger={updateFormState}/>
            )
          }
         
          {
            formType === 'confirmSingIn' && (
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="reportDownload" element={<ReportDownload />} />
              </Routes>
            )
          }
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}


export default App;