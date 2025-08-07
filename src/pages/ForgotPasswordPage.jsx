import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSendOTP = async (data) => {
    const email = data.email;
    console.log("form submitted with ", data);
    const response = await fetch(
      "https://workout-project-1.onrender.com/api/user/forgot-password",
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
            {...register("email", { required: "Email is required" })}
            className={`mt-1 w-full px-4 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 ">{errors.email.message}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Send OTP
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordPage;
