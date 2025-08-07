import { WorkoutsContext } from "../Context/WorkoutsContext";
import { useContext } from "react";

export const useWorkoutContext=()=>{
    const context=useContext(WorkoutsContext)

    if(!context){
        throw new Error("useWorkoutContext must be used inside a workoutProvider");
        
    }

    return context
}