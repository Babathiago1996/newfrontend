import { useAuthContext } from "../hooks/useAuthContext";
import { useWorkoutContext } from "./useWorkoutContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const {dispatch:workoutDispatch}=useWorkoutContext();
  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" })
    workoutDispatch({type:"SET_WORKOUTS", paylod:null});
  };

  return {logout}
};
