import React, { useState } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import { FaClipboardCheck } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const WorkoutForm = () => {
  const [title, setTitle] = useState("");
  const [reps, setReps] = useState("");
  const [load, setLoad] = useState("");
  const [error, setError] = useState(null);
  const [isloading, setisLoading] = useState(false);
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();
  const redirect = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);

    if (!user) {
      toast.error("you must be logged in");
      return;
    }
    const workout = { title, load, reps };
    const response = await fetch(
      "https://newbackendfresh.onrender.com/api/workouts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(workout),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setError(json.error || "workout creation failed");
      toast.error("Error Adding Workout");
    }
    if (response.ok) {
      setError(null);
      setTitle("");
      setLoad("");
      setReps("");
      dispatch({ type: "CREATE_WORKOUT", payload: json });
      toast.success("Workout Added Successfully");
      redirect("/");
    }
    setisLoading(false);
  };
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 mt-4 text-center ">
        {" "}
        Add A New Workout
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-2xl">
            Exercise Title <sup className="text-red-500">*</sup>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-[50px] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-2xl">
            Load (in Kg)<sup className="text-red-500">*</sup>
          </label>
          <input
            type="number"
            value={load}
            onChange={(e) => setLoad(e.target.value)}
            className="w-full h-[50px] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-2xl">
            Workout Reps <sup className="text-red-500">*</sup>
          </label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full h-[50px] border  border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full h-[60px] bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          {isloading ? (
            <>
              <ClipLoader size={20} color="#fff" />
              <span className="text-[20px]">Adding...</span>
            </>
          ) : (
            <>
              <FaClipboardCheck size={12} />
              <span className="text-[20px]">Add Workout</span>
            </>
          )}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default WorkoutForm;
