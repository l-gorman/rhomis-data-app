/* See this tutorial for authentication state management
https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
https://reactrouter.com/web/example/auth-workflow 
*/

// Import styling
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import router information
import React, { useState, useEffect, useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";



// Import the various components
import { LoginComponent } from "./components/login-component/login-component"
import { DataQueryComponent } from "./components/data-query-component/data-query-component"
import HomePageComponent from './components/homepage-component/homepage-component';
import ProjectManagementComponent from "./components/project-management-component/project-management-component"
// import AccountManagementComponent from './components/account-management-component/account-management-component';
import PublicDataComponent from './components/public-data-component/public-data-component';
import CollectDataComponent from './components/collect-data-component/collect-data-component';
import MainNavbar from './components/navigation-bar/navigation-bar-component'

import { Fade } from 'react-bootstrap';

// Import the context which stores the authentication tokens
import AuthContext, { AuthContextProvider } from './components/authentication-component/AuthContext';

function Logout() {
  const [authToken, setAuthToken] = useState(AuthContext);
  console.log("clicked")
}


function App() {
  const [authToken, setAuthToken] = useState(null);

  return (
    < Router >
      <Fade>
        <Switch>
          <AuthContext.Provider value={[authToken, setAuthToken]}>


            {/* If auth token does not exist, do not render the main navigation bar */}

            <div className="background">

              <div className="main-page">
                {authToken ? <MainNavbar Logout={Logout} /> : null}


                {/* Render login route  */}
                <Route path="/login">
                  <LoginComponent />
                </Route>
                {/* If the auth token does not exist, can render each of these components */}
                {authToken ?
                  <>
                    <Route exact path="/" component={HomePageComponent}></Route>
                    <Route path="/project-management" component={ProjectManagementComponent}></Route>
                    <Route path="/data-collection" component={CollectDataComponent}></Route>
                    <Route path="/global-data" component={PublicDataComponent}></Route>
                    <Route path="/data-querying" component={DataQueryComponent}></Route>

                    {/* <Route path="/account" component={AccountManagementComponent}></Route> */}
                  </>
                  : <Redirect to="/login" />}

              </div >
            </div>
          </AuthContext.Provider>

        </Switch>
      </Fade>
    </Router >


  );
}

export default App;
