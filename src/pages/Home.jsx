import React from "react";
import { useState, useEffect } from "react";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Loader";
import { useRef } from "react";
import { BiDumbbell } from "react-icons/bi";
import { FiFrown } from "react-icons/fi";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const { workouts, dispatch } = useWorkoutContext();
  const [isloading, setisLoading] = useState(true);
  const { user } = useAuthContext();

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!user || !user.token) {
      toast.error("You're not logged in");
      setisLoading(false);
      return;
    }
    const fetchdata = async () => {
      try {
        const response = await fetch(`${API_URL}/api/workouts`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (response.ok) {
          dispatch({ type: "SET_WORKOUTS", payload: json });
          if (json.length === 0 && !hasShownToast.current) {
            toast.info("No workouts Found");
            hasShownToast.current = true;
          }
        } else {
          toast.error(json?.error || "Failed to fetch workouts");
        }
      } catch (error) {
        toast.error("Network error fetching workouts");
      } finally {
        setisLoading(false);
      }
    };

    fetchdata();
  }, [dispatch, user]);
  return (
    <div className="bg-image h-screen">
      <div className=" flex flex-col md:flex-row p-4 gap-8 max-w-7xl mx-auto">
        <div className="md:w-2/3 space-y-4">
          <h1 className="text-4xl font-bold mb-2 text-white ">
            Workout History
          </h1>

          {isloading ? (
            <Loader isloading={true} />
          ) : workouts && workouts.length > 0 ? (
            workouts.map((workout) => {
              return <WorkoutDetails key={workout._id} workout={workout} />;
            })
          ) : (
            <div className="text-center text-gray-50 text-lg md:text-[35px] font-bold mt-10 flex flex-col items-center">
              <div className="flex gap-1">
                <FiFrown className="text-7xl text-blue-500 mb-2" />
                <BiDumbbell className="text-7xl text-blue-500 mb-2" />
              </div>
              No workouts Found
              <Link to="/create">
                <p className="hover:underline hover:text-green-200 hover:text-[27px] text-2xl hover:font-bold ">
                  {" "}
                  create a workout
                </p>
              </Link>
            </div>
          )}
        </div>
        <div className="md:w-1/3 bg-white shadow-md rounded-xl p-4 border border-gray-200">
          <WorkoutForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
