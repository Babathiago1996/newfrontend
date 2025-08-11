import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import team from "../assets/workoutApplogo.jpg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

const RegisterPage = () => {
  const [showpassword, setShowPassword] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const handleRegister = async (data) => {
    setIsloading(true);

    try {
      const response = await fetch(
        "https://newbackendfresh.onrender.com/api/user/signUp",
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
        toast.success(json.message);
        navigate("/verify-otp", { state: { email } });
      } else {
        toast.error(json.message || "registration Failed");
      }
    } catch (error) {
      toast.error("an error occured. please try again.");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100">
      <div className="md:w-1/2 w-full h-64 md:h-screen overflow-hidden">
        <img src={team} alt="team" className="object-cover w-full h-full" />
      </div>
      <div className="md:w-1/2 w-full px-4 md:px-8 py-10 bg-gray-100 flex justify-center">
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email<sup className="text-red-500">*</sup>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full p-2 border  rounded-lg outline-none ${
                errors.email
                  ? "border-red-400 border-2 "
                  : " border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password<sup className="text-red-400">*</sup>
            </label>
            <input
              type={showpassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                  message: "Min 8 chars, upper, lower, number & special char",
                },
              })}
              className={`w-full p-2 border rounded-lg outline-none 
                ${
                  errors.password
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
            {errors.password && (
              <p className="text-sm text-red-400 mt-1">
                {errors.password.message}
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
            disabled={isloading || !isValid}
          >
            {isloading ? (
              <div className="flex gap-2 justify-center items-center">
                <ClipLoader size={20} color="#FFD700" /> registering...
              </div>
            ) : (
              " Sign Up"
            )}
          </button>
          <ToastContainer />
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
