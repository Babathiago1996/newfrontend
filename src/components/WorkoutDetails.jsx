import React, { useState } from "react";
import moment from "moment";
import ShowModal from "./ShowModal";
import { ToastContainer, toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const WorkoutDetails = ({ workout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(workout.title);
  const [reps, setReps] = useState(workout.reps);
  const [load, setLoad] = useState(workout.load);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isdeleting, setIsDeleting] = useState(false);
  const { dispatch } = useWorkoutContext();

  const { user } = useAuthContext();
  const openModal = () => {
    setShowModal(true);
    setTimeout(() => {
      setShowAnimation(true);
    }, 10);
  };
  const closeModal = () => {
    setShowAnimation(false);
    setTimeout(() => {
      setShowModal(false);
    }, 300);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    // const confirmed = window.confirm(
    //   "Are your sure you want to delete this workout ?"
    // );
    // if (!confirmed) return;

    if (!user) {
      toast.error("you must be logged in");
      return;
    }
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/workouts/${workout._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setShowModal(false);
        dispatch({ type: "DELETE_WORKOUT", payload: json });
        toast.success("workout deleted");
        closeModal();
      } else {
        setError(json.error);
        toast.error("server error");
      }
    } catch (error) {
      setIsDeleting(false);
    }
  };
  const handleCancel = () => {
    setError(null);
    setTitle("");
    setLoad("");
    setReps("");
    setIsEditing(false);
  };
  const handleSave = async () => {
    if (!user) {
      toast.error("you must be logged in");
      return;
    }
    if (
      title === workout.title &&
      load === workout.load &&
      reps === workout.reps
    ) {
      setIsEditing(false);
      return;
    }
    const updateWorkout = { title, reps, load };
    try {
      const response = await fetch(`${API_URL}/api/workouts/${workout._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updateWorkout),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error || "Update Failed");
        toast.error("server error");
      } else {
        setError(null);
        setIsEditing(false);
        toast.success("Workout Updated Successfully");

        window.location.reload();
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  return (
    <div>
      <div className="bg-white  shadow-lg rounded-xl p-6 mb-6 w-full max-w-3xl mx-auto transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 justify-between items-start">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800  capitalize ">
            <strong className="text-green-600">Title: </strong>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full sm:w-64 mt-2 sm:mt-0 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            ) : (
              workout.title
            )}
          </h2>
          <div className="flex gap-3 mt-4 sm:mt-0">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="text-sm px-4 py-2 transition font-medium rounded-md bg-yellow-400 hover:bg-yellow-500 text-white"
                >
                  Edit
                </button>
                <button
                  onClick={openModal}
                  className="text-sm  px-4 py-2 font-medium transition rounded-md bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="text-[15px] px-4 py-2 transition font-medium rounded-md bg-yellow-400 hover:bg-yellow-500 text-white"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="text-[15px] px-4 py-2 transition font-medium rounded-md bg-red-500 hover:bg-red-600 text-white"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
        <div className="space-y-2 text-base sm:text-lg text-gray-700">
          <p>
            <span className="text-blue-500 font-semibold">Load (kg) : </span>{" "}
            {isEditing ? (
              <input
                type="text"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                className="border border-gray-300 p-2  rounded w-full outline-0 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            ) : (
              workout.load
            )}
          </p>
          <p>
            <span className="text-red-500 font-semibold">Reps: </span>{" "}
            {isEditing ? (
              <input
                type="text"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="border border-gray-300  p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 rounded w-full outline-0 "
              />
            ) : (
              workout.reps
            )}
          </p>
        </div>
        {!isEditing && (
          <div className="mt-4 text-sm sm:text-base text-gray-500">
            <p className="text-[19px] text-gray-400 mt-2">
              <span className="font-semibold">Created: </span>
              {moment(workout.createdAt).fromNow()}
            </p>
            <p className="text-[19px] text-gray-400">
              <span className="font-semibold">Updated: </span>
              {moment(workout.updatedAt).fromNow()}
            </p>
          </div>
        )}
      </div>
      {showModal && (
        <ShowModal
          closeModal={closeModal}
          handleDelete={handleDelete}
          isdeleting={isdeleting}
        />
      )}
    </div>
  );
};

export default WorkoutDetails;
