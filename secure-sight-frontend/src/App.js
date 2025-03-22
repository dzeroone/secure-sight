import React from "react";
import Routes from "./Routes/index";

// Import Scss
import { ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "./assets/scss/theme.scss";

function App() {
  return (
    <React.Fragment>
      <Routes />
      <ToastContainer theme="light" autoClose={5000} />
    </React.Fragment>
  );
}
export default App;



