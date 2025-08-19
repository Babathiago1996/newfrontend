import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import WorkoutForm from "./components/WorkoutForm";
// import { jwtDecode } from "jwt-decode";
// import { useEffect } from "react";
function App() {
  // const { user, dispatch } = useAuthContext();

  const { user } = useAuthContext();
  // useEffect(() => {
  //   if (user?.token) {
  //     try {
  //       const decoded = jwtDecode(user.token);
  //       const now = Date.now() / 1000;
  //       if (decoded.exp < now) {
  //         localStorage.removeItem("user");
  //         dispatch({ type: "LOGOUT" });
  //         window.location.href = "/login?expired=true";
  //       } else {
  //         const timeout = (decoded.exp - now) * 1000;
  //         const timer = setTimeout(() => {
  //           localStorage.removeItem("user");
  //           dispatch({ type: "LOGOUT" });
  //           window.location.href = "/login?expired=true";
  //         }, timeout);
  //         return () => clearTimeout(timer);
  //       }
  //     } catch (error) {
  //       console.error("Token decode error:", error);
  //       localStorage.removeItem("user");
  //       dispatch({ type: "LOGOUT" });
  //     }
  //   }
  // }, [user, dispatch]);
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/signUp"
          element={!user ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/create" element={<WorkoutForm />} />
      </Routes>
    </div>
  );
}

export default App;
