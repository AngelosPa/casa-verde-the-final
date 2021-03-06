import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import axios from "axios";
import "../src/sass/main.scss";
axios.defaults.baseURL = "http://localhost:5005/";
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
