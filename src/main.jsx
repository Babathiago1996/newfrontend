import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { WorkoutsProvider } from "./Context/WorkoutsContext.jsx";
import { AuthContextProvider } from "./Context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import { AuthContextBridge } from "./helpers/authHelper.jsx";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <AuthContextProvider>
      <AuthContextBridge>
        <WorkoutsProvider>
          <App />
          <ToastContainer autoClose={2000} position="top-right" />
        </WorkoutsProvider>
      </AuthContextBridge>
    </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
