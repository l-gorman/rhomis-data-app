// Copyright (C) 2022 Léo Gorman
// 
// This file is part of rhomis-data-app.
// 
// rhomis-data-app is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// rhomis-data-app is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with rhomis-data-app.  If not, see <http://www.gnu.org/licenses/>.

/* See this tutorial for authentication state management
https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
https://reactrouter.com/web/example/auth-workflow 
*/

// Import styling
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// Import router information
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Import the various components
import RoutingComponent from './components/routing-component/routing-component';
import { Fade } from 'react-bootstrap';

// Import the context which stores the authentication tokens
import AuthContext from './components/authentication-component/AuthContext';
import UserContext from './components/user-info-component/UserContext';




function CheckForLocalToken(props) {
  const localToken = localStorage.getItem("userToken")

  const currentDate = new Date()
  const localTokenCreationTime = new Date(localStorage.getItem("createdAt"))

  console.log("Difference")
  console.log(currentDate.getTime() - localTokenCreationTime.getTime())

  const timeDifference = currentDate.getTime() - localTokenCreationTime.getTime()
  if (timeDifference < 60 * 60 * 1000) {
    props.setAuthToken(localToken)
    return
  }
}

async function FetchUserInformation(props) {
  const response = await axios({
    method: "get",
    url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/",
    headers: {
      'Authorization': props.authToken
    }
  })
  console.log("user info")
  console.log(response.data)

  return (response.data)

}

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null)



  useEffect(() => {
    CheckForLocalToken({
      setAuthToken: setAuthToken
    })
  }, [])

  useEffect(() => {
    FetchUserInformation({
      authToken: authToken,
      setUserInfo: setUserInfo
    })
  }, [authToken])

  // Automatically log out 
  // after 1 hour of use
  setTimeout(() => {
    setAuthToken(null);
    localStorage.clear()
  }, 60 * 60 * 1000);

  return (
    <AuthContext.Provider value={[authToken, setAuthToken]}>
      <UserContext.Provider value={[userInfo, setUserInfo]}>
        <div className="main-app-background">
          <div className="main-page">
            <RoutingComponent />
          </div >
        </div>
      </UserContext.Provider>
    </AuthContext.Provider>



  );
}

export default App;
