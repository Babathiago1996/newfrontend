import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { WorkoutsProvider } from "./Context/WorkoutsContext.jsx";
import { AuthContextProvider } from "./Context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <WorkoutsProvider>
        <App />
        <ToastContainer autoClose={3000} position="top-right" />
      </WorkoutsProvider>
    </AuthContextProvider>
  </StrictMode>
);
