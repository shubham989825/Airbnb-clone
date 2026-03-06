import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // global styles
import "./styles/Navbar.css";
import "./styles/PropertyCard.css";
import "./styles/Login.css";
import "./styles/Register.css";
import "./styles/Home.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);