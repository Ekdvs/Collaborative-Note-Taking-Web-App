import React, { useState } from "react";
import { LogIn, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Axios } from "../utils/Axios";
import SummaryApi from "../api/SummaryApi";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {

      const res = await Axios({
        method: SummaryApi.login.method,
        url: SummaryApi.login.url,
        data: formData,
        withCredentials: true
      });

      if (res.data.success) {

        const token = res.data.data.accessToken;

        localStorage.setItem("token", token);

        Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        toast.success("Login Successful!");

        navigate("/dashboard");

      } else {
        toast.error(res.data.message || "Login failed!");
      }

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="w-full h-screen bg-[url('/bglogin.jpg')] bg-cover bg-center flex items-center justify-center">

      {/* Left Section */}
      <div className="hidden lg:flex w-[50%] h-full flex-col items-center justify-center gap-10 bg-black/50 p-10">

        <img
          src="/logo.png"
          alt="logo"
          className="w-[180px] h-[180px] object-contain opacity-90 drop-shadow-lg"
        />

        <h1 className="text-5xl font-bold text-[#FFD700] text-center drop-shadow-lg">
          Your Gateway to Smarter Notes.
        </h1>

        <p className="text-gray-200 text-lg w-[400px] text-center italic">
          Capture ideas, collaborate with others, and keep everything organized.
        </p>

        <Link to="/register">
          <button className="px-8 py-3 bg-[#FFD700] text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
            Get Started
          </button>
        </Link>

      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[50%] h-full bg-black/50 flex items-center justify-center">

        <div className="w-[90%] max-w-[450px] backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-8 p-8">

          <h1 className="text-3xl font-semibold text-[#FFD700] text-center">
            Login to Your Account
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center gap-6"
          >

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-[80%] h-[50px] rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />

            {/* Password */}
            <div className="relative w-[80%]">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-[50px] rounded-lg p-3 pr-12 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-3 text-gray-400 hover:text-[#FFD700]"
              >
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>

            </div>

            {/* Remember + Forgot */}
            <div className="w-[80%] flex justify-between text-sm text-gray-300">

              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#FFD700]" />
                Remember Me
              </label>

              <Link to="/forgot" className="text-[#FFD700] hover:underline">
                Forgot Password?
              </Link>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-3 w-[80%] py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold shadow-md"
            >

              <LogIn size={20}/>

              {loading ? "Logging in..." : "Login"}

            </button>

          </form>

          <p className="text-gray-300 text-sm mt-4">

            Don’t have an account?{" "}

            <Link to="/register" className="text-[#FFD700] hover:underline">
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>

  );
};

export default Login;