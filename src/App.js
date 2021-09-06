import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';



import LoginComponent from "./components/login-component/login-component"
import { DataQueryComponent } from "./components/data-query-component/data-query-component"

function RenderComponent(props) {
  if (props.authToken !== null) return <DataQueryComponent authToken={props.authToken} />
  if (props.authToken === null) return <LoginComponent authToken={props.authToken} setAuthToken={props.setAuthToken} />
  return null

}

function App() {

  const [authToken, setAuthToken] = useState(null)

  return (
    <div className="main-page">
      {/* <DataQueryComponent /> */}


      <RenderComponent authToken={authToken} setAuthToken={setAuthToken} />
      { }
    </div>
  );
}

export default App;
