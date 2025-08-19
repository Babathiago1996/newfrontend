import axios from "axios";
import { toast } from "react-toastify";
import { getAuthContext } from "../helpers/authHelper";
const api = axios.create({
  baseURL: "https://newbackendfresh.onrender.com/api", // change this to your backend URL
});
// Interceptor to handle expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      (error.response.data?.error?.name === "TokenExpiredError" ||
        error.response.data?.error === "jwt expired")
    ) {
      // Clear storage and redirect
      const { logout } = getAuthContext();
      if (logout) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
