import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, LogIn, UserPlus, LogOut } from "lucide-react";
import { Axios } from "../utils/Axios";
import SummaryApi from "../api/SummaryApi";
import toast from "react-hot-toast";

const navItems = [ "About", "Contact"];

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

   const handleLogout = async () => {
  try {
    const res = await Axios({
      method: SummaryApi.logout.method,
      url: SummaryApi.logout.url,
    });

    if (res.data.success) {
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      navigate("/login");
    } else {
      toast.error("Logout failed");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong during logout");
  }
};

  return (
    <nav className="w-full bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          
          <span className="text-2xl font-bold">My Notes</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item}
              to={`/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md font-semibold transition duration-300 ${
                  isActive ? "bg-white text-blue-600" : "hover:bg-blue-500"
                }`
              }
            >
              {item}
            </NavLink>
          ))}

          {/* Dashboard */}
          {token && (
            <User
              className="w-6 h-6 cursor-pointer hover:text-gray-200"
              onClick={() => navigate("/dashboard")}
            />
          )}

          {/* Login/Register or Logout */}
          {!token ? (
            <>
              <NavLink
                to="/login"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-1"
              >
                <LogIn size={18} /> Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 flex items-center gap-1"
              >
                <UserPlus size={18} /> Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 flex items-center gap-1"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;