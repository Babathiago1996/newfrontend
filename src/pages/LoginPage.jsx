import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import team from "../assets/prettyface.jpg";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [showpassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();
  const handleLogin = async (data) => {
    const { email, password } = data;
    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(json));
        dispatch({ type: "LOGIN", payload: json });
        toast.success(json.message);

        navigate("/");
      } else {
        toast.error(json.error || json.message);
      }
    } catch (error) {
      toast.error(error.message || "registration Failed");
    }
  };
  return (
    <div className="bg-team min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>
          <input
            type="email"
            placeholder="Enter your registered email"
            aria-label="Enter your Email"
            {...register("email", { required: "Email is required" })}
            className={`mt-1 w-full px-4 py-2 border h-[50px] ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 ">{errors.email.message}</p>
          )}
          <div className="relative mb-4">
            <input
              type={showpassword ? "text" : "password"}
              placeholder="Enter your registered Password"
              required
              aria-label="Enter your Password"
              {...register("password", {
                required: "password is required",
                minLength: {
                  value: 8,
                  message:
                    "Password must be atleast 8 character,including UpperCase,LowerCase and sign",
                },
              })}
              className={`mt-1 w-full px-4 pt-2 border  h-[50px] ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
            />
            <div
              className="absolute top-5 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showpassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 ">
                {errors.password.message}
              </p>
            )}
          </div>
          <Link to="/forgot-password">
            <h3 className="text-black p-2">Forgot-password</h3>
          </Link>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoginPage;
