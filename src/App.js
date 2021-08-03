import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// import LoginComponent from "./components/login-component/login-component"
import DataQueryComponent from "./components/data-query-component/data-query-component"
function App() {
  return (
    <div className="main-page">
      {/* <DataViewer /> */}
      <DataQueryComponent />
      {/* <LoginComponent /> */}
    </div>
  );
}

export default App;
