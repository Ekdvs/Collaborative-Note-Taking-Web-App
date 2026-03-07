import React, { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Axios } from "../utils/Axios";
import SummaryApi from "../api/SummaryApi";


const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Validation
  const validate = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return false;
    }

    return true;
  };

  // Submit register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await Axios({
        method: SummaryApi.register.method,
        url: SummaryApi.register.url,
        
        data: {
          name: formData.name,
          email: formData.email,
          password: formData.password
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed!");
      }

    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="w-full h-screen bg-[url('/bglogin.jpg')] bg-cover bg-center flex items-center justify-center mt-[30px]">
      
      {/* Left Section */}
      <div className="hidden lg:flex w-[50%] h-full flex-col items-center justify-center gap-10 bg-black/50 p-10">

        <img
          src="/logo.png"
          alt="logo"
          className="w-[180px] h-[180px] opacity-90 drop-shadow-lg"
        />

        <h1 className="text-5xl font-bold text-[#FFD700]">
          Create Your Account
        </h1>

        <p className="text-gray-200 text-lg w-[400px] text-center italic">
          Organize your ideas and collaborate with others using our Notes App.
        </p>

        <Link to="/login">
          <button className="px-8 py-3 bg-[#FFD700] text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition">
            Already have an account?
          </button>
        </Link>

      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[50%] h-full bg-black/50 flex items-center justify-center">

        <div className="w-[90%] max-w-[450px] backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center gap-8 p-8">

          <h1 className="text-3xl font-semibold text-[#FFD700]">
            Register
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center gap-6"
          >

            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-[80%] h-[50px] rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FFD700]"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-[80%] h-[50px] rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FFD700]"
            />

            {/* Password */}
            <div className="relative w-[80%]">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-[50px] rounded-lg p-3 pr-12 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FFD700]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-[#FFD700]"
              >
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>

            </div>

            {/* Confirm Password */}
            <div className="relative w-[80%]">

              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-[50px] rounded-lg p-3 pr-12 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FFD700]"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-3 text-gray-400 hover:text-[#FFD700]"
              >
                {showConfirmPass ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>

            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-3 w-[80%] py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold shadow-md hover:opacity-90"
            >
              <UserPlus size={20}/>
              {loading ? "Creating account..." : "Register"}
            </button>

          </form>

          <p className="text-gray-300 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FFD700] hover:underline">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;