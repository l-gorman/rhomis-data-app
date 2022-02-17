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
  HashRouter as Router,
  //BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";



// Import the various components
import { LoginComponent } from "./components/login-component/login-component"
import { DataQueryComponent } from "./components/data-query-component/data-query-component"
import { RegisterComponent } from './components/register-component/register-component';
import PortalComponent from './components/portal-component/portal-component';
import ProjectManagementComponent from "./components/project-management-component/project-management-component"
// import AccountManagementComponent from './components/account-management-component/account-management-component';
import MainNavbar from './components/navigation-bar/navigation-bar-component'
import FormCreationComponent from './components/form-creation-component/form-creation-component';
import { Fade } from 'react-bootstrap';

// Import the context which stores the authentication tokens
import AuthContext, { AuthContextProvider } from './components/authentication-component/AuthContext';



function ProtectedRoute(props) {
  console.log("Protected route")
  console.log(props)

  if (props.path !== "/") {
    return (
      <Route path={props.path}>
        {props.authToken ? <props.component /> : <Redirect to="/login" />}
      </Route>
    )
  }

  if (props.path === "/") {
    return (
      <Route exact path={props.path}>
        {props.authToken ? <props.component /> : <Redirect to="/login" />}
      </Route>
    )

  }
}



function App() {
  const [authToken, setAuthToken] = useState(null);
  // Automatically log out 
  // after 1 hour of use
  setTimeout(() => {
    setAuthToken(null);
    localStorage.clear()
  }, 60 * 60 * 1000);

  return (
    < Router >
      <Fade>
        <Switch>
          <AuthContext.Provider value={[authToken, setAuthToken]}>
            {/* If auth token does not exist, do not render the main navigation bar */}

            <div className="main-app-background">
              <div className="main-page">
                {authToken ? <MainNavbar /> : null}


                {/* Render login route  */}
                <Route path="/login"> <LoginComponent /></Route>
                <Route path="/register"><RegisterComponent /></Route>
                <ProtectedRoute path="/project-management" component={ProjectManagementComponent} authToken={authToken} />
                <ProtectedRoute path="/data-querying" component={DataQueryComponent} authToken={authToken} />
                <ProtectedRoute path="/administration" component={FormCreationComponent} authToken={authToken} />

                {/* If the auth token does not exist, can render each of these components */}
                {authToken ?
                  <>
                    <Route exact path="/" component={PortalComponent}></Route>
                    {/* <Route path="/data-collection" component={CollectDataComponent}></Route> */}
                    {/* <Route path="/global-data" component={PublicDataComponent}></Route> */}
                    <Route path="/data-querying" component={DataQueryComponent}></Route>
                    <Route path="/administration" component={FormCreationComponent}></Route>


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
