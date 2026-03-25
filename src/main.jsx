import React from "react";
import ReactDOM from "react-dom/client"
import "bootstrap/dist/css/bootstrap.min.css"
import "./i18n/i18n.js"
import "flag-icons/css/flag-icons.min.css"

import App from "./App.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)