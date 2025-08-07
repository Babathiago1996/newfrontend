import React from "react";
import { Link } from "react-router-dom";
import imgs from "../assets/iFitness.png";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-black text-white shadow-md py-3">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={imgs} alt="ifitness_logo" className="h-10 w-auto" />
        </Link>

        <nav className="flex items-center gap-6">
          {user && (
            <><span className="hidden sm:inline">{user.email}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md transition">Logout</button>
            </>
          )}
          {!user && (
            <div className="flex gap-4">
               <Link to="/login" className="hover:text-gray-300 transition duration-200">Login</Link>
              <Link to="/signUp" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
