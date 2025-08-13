import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useForm } from "react-hook-form";

const ResetPasswordPage = () => {
  const [counter, setCounter] = useState(60);
  const [showpassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const email = state?.email;
  const navigate = useNavigate();
  useEffect(() => {
    const timer =
      counter > 0 &&
      setInterval(() => {
        setCounter((c) => c - 1);
      }, 1000);

    return () => clearInterval(timer);
  }, [counter]);
  const handleReset = async (data) => {
    const { newPassword, otp } = data;
    if (!email) {
      toast.error(
        "Email is missing. please restart the password reset process."
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
        toast.success(json.message || "password reset successfully!", {
          onClose: () => navigate("/login"),
        });
      } else {
        const errorMessage =
          json.message || json.error || json.error?.message || "Reset failed ";
        if (errorMessage.toLowerCase().includes("expired")) {
          toast.error("OTP has expired. please request a new one");
        } else if (errorMessage.toLowerCase().includes("invalid")) {
          toast.error("incorrect OTP. please try again. ");
        } else if (errorMessage.toLowerCase().includes("same password")) {
          toast.error(
            "you cannot reuse your old password. please choose a different one."
          );
        } else {
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
        <Link to="/forgot-password">
          <button
            className="flex items-center gap-1 px-4 py-2 mb-4 
                       text-sm font-medium text-gray-600 
                       border border-gray-300 rounded-full 
                       hover:bg-gray-100 hover:text-gray-800 
                       transition-all duration-200 ease-in-out
                       shadow-sm hover:shadow"
          >
            <IoIosArrowRoundBack size={20} />
            Back
          </button>
        </Link>

        <form onSubmit={handleSubmit(handleReset)} className="space-y-6">
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
              maxLength={4}
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: "OTP must be a 4-digit number",
                },
              })}
              className={`w-full p-2 border rounded-lg outline-none 
    ${
      errors.otp
        ? "border-red-400 border-2"
        : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 "
    }`}
            />
            {errors.otp && (
              <p className="text-red-400 text-sm">{errors.otp.message}</p>
            )}
          </div>
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Password
            </label>
            <input
              type={showpassword ? "text" : "password"}
              placeholder="New Password"
              {...register("newPassword", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                  message: "Min 8 chars, upper, lower, number & special char",
                },
              })}
              className={`w-full p-2 border rounded-lg outline-none 
                ${
                  errors.newPassword
                    ? "border-red-400 border-2"
                    : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                }`}
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
            {errors.newPassword && (
              <p className="text-sm text-red-400 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full text-white p-2 rounded transition duration-200 ${
              isValid
                ? " bg-blue-500  hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={loading || !isValid}
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
                className={`font-medium ${
                  counter > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:underline"
                }`}
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
