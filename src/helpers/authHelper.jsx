import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";

let authContextValue;

export const AuthContextBridge = ({ children }) => {
  authContextValue = useContext(AuthContext);
  return children;
};
export const getAuthContext = () => {
  return authContextValue;
};
