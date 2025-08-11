import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ClipLoader } from "react-spinners";

import team from "../assets/prettyface.jpg";

const LoginPage = () => {
  const [showpassword, setShowPassword] = useState(false);
  const [isloading, setIsloading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();
  const handleLogin = async (data) => {
    setIsloading(true);

    try {
      const response = await fetch(
        "https://newbackendfresh.onrender.com/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email, password: data.password }),
        }
      );
      const json = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(json));
        dispatch({ type: "LOGIN", payload: json });
        toast.success(json.message);

        navigate("/");
      } else {
        toast.error(json.error || json.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "registration Failed");
    } finally {
      setIsloading(false);
    }
  };
  return (
    <div className="bg-team min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>
          <div>
            <input
              type="email"
              placeholder="Enter your registered email"
              aria-label="Enter your Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`mt-1 w-full px-4 py-2 border h-[50px] outline-none rounded-lg ${
                errors.email
                  ? "border-red-400 border-2"
                  : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              }  `}
            />
            {errors.email && (
              <p className=" mt-1 text-sm text-red-600 ">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="relative mb-4">
            <input
              type={showpassword ? "text" : "password"}
              placeholder="Enter your registered Password"
              required
              aria-label="Enter your Password"
              {...register("password", {
                required: "password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                  message:
                    "Password must be atleast 8 character,including UpperCase,LowerCase and special character",
                },
                minLength: {
                  value: 8,
                },
              })}
              className={`mt-1 w-full px-4 pt-2 border rounded-lg h-[50px] outline-none ${
                errors.password
                  ? "border-red-400 border-2"
                  : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              }  `}
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
            className={`w-full bg-blue-600 text-white py-2 rounded-lg transition duration-200 ${
              isValid
                ? " hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={isloading || !isValid}
          >
            {isloading ? (
              <div className="flex gap-2 justify-center items-center">
                <ClipLoader size={20} color="#32CD32" /> login....{" "}
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoginPage;
