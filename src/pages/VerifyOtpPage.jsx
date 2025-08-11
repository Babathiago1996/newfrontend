import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const VerifyOtpPage = () => {
  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(60);
  const email = state?.email;
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    if (!email) {
      toast.error("No email provided. Redirecting to login...");
      navigate("/login");
    }
  }, [email, navigate]);
  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setInterval(() => {
        setCounter((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [counter]);
  const handleVerify = async () => {
    if (!otp || otp.length !== 4 || isNaN(otp)) {
      toast.error("please enter a valid 4-digit OTP");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/user/verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const json = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(json));
        dispatch({ type: "LOGIN", payload: json });
        toast.success(json.message);
        navigate("/");
      } else {
        toast.error(json.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error(error.message || "Network error");
    }
  };
  const handleResend = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const json = await response.json();
      if (response.ok) {
        toast.success(json.message);
        setCounter(60);
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      toast.error(error.message || "an error occured. please try again");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg  w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Verify OTP
        </h2>
        <p className="text-center text-gray-600 mb-6">
          An OTP has been sent to <span className="font-semibold">{email}</span>{" "}
        </p>
        <div className="mb-6">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 4-digit OTP"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength="4"
          />
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:ng-blue-700 transition duration-300 mb-4"
        >
          Verify
        </button>
        <button
          onClick={handleResend}
          disabled={counter > 0}
          className={`w-full py-2 rounded-lg transition duration-300 ${
            counter > 0
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Resend OTP {counter > 0 ? `in ${counter}s` : ""}
        </button>
        <ToastContainer position="top-right" />
      </div>
    </div>
  );
};

export default VerifyOtpPage;
