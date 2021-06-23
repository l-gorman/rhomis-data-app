import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginComponent from "./components/login-component/login-component"
import DataViewer from "./components/data-viewing-component/data-viewing-component"

function App() {
  return (
    <div className="main-page-container">
      <DataViewer />
      {/* <LoginComponent /> */}
    </div>
  );
}

export default App;
