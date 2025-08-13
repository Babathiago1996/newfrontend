import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const handleSendOTP = async (data) => {
    setIsloading(true);
    const email = data.email;
    console.log("form submitted with ", data);
    try {
      const response = await fetch(
        "https://newbackendfresh.onrender.com/api/user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const json = await response.json();
      if (response.ok) {
        toast.success(json.message);
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(json.error.message);
      }
    } catch (error) {
      toast.error(error.message || "an error occured. please try again");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit(handleSendOTP)} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Forgot Password
          </h2>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email<sup className="text-red-500">*</sup>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your registerd Email"
            aria-label="Enter your Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            className={`mt-1 w-full px-4 py-2 border ${
              errors.email ? "border-red-400 border-2" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 ">{errors.email.message}</p>
          )}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-lg transition duration-200 ${
              isValid
                ? " hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={isloading || !isValid}
          >
            {isloading ? (
              <div className="flex gap-2 justify-center items-center">
                <ClipLoader size={20} color="#32CD32" /> Sending....{" "}
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordPage;
