import { createContext, useEffect } from "react";
import { useReducer } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });
  const Navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    toast.error("Session expired. Please log in again", {
      toastId: "Session-expired",
    });
    setTimeout(() => {
      Navigate("/login");
    }, 2000);
  };
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token) {
      try {
        const decoded = jwtDecode(storedUser.token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          logout();
        } else {
          dispatch({ type: "LOGIN", payload: storedUser });
          const timeout = (decoded.exp - now) * 1000;
          const timer = setTimeout(() => {
            logout();
          }, timeout);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
