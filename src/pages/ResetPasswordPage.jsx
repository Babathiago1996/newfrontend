import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ResetPasswordPage = () => {
  const [counter, setCounter] = useState(60);
  const [showpassword, setShowPassword] = useState(false);

  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const email = state?.email;
  const navigate = useNavigate();
  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setInterval(() => {
        setCounter((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [counter]);
  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error(
        "Email is missin. please restart the password reset process."
      );
      return;
    }
    if (!otp || !newPassword) {
      toast.error("please fill in all field");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://newbackendfresh.onrender.com/api/user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );
      const json = await response.json();
      if (response.ok) {
        toast.success(json.message || "password reset successfully!");
        setTimeout(() => {
          navigate("/");

          localStorage.setItem("user", JSON.stringify(json));
        }, 2000);
      } else {
        if (json.error?.message?.toLowerCase().includes("expired")) {
          toast.error("OTP has expired. please request a new one");
        } else if (json.message?.message?.toLowerCase().includes("invalid")) {
          toast.error("incorrect OTP. please try again. ");
        } else {
          const errorMessage =
            json?.message || json?.error?.message || "Reset failed ";
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      toast.error(error.message || "an error occured. please try again");
    } finally {
      setLoading(false);
    }
  };
  const handleResendOTP = async () => {
    if (!email) {
      toast.error("No email found. please go back and enter your email");
      return;
    }
    try {
      const response = await fetch(
        "https://newbackendfresh.onrender.com/api/user/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, purpose: "reset" }),
        }
      );
      const json = await response.json();
      if (response.ok) {
        toast.success("OTP has been resent to your email" || json.message);
        setCounter(60);
      } else {
        toast.error(json.error?.message || "failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.message || "Could not resend OTP. please try again");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleReset} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Reset Password
          </h2>
          <div className="mb-6">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Password
            </label>
            <input
              type={showpassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              className="absolute top-10 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showpassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Didn't receive or OTP expired?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={counter > 0}
                className="text-blue-600 font-medium hover:underline"
              >
                {" "}
                Resend OTP {counter > 0 ? `in ${counter}s` : ""}
              </button>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordPage;
