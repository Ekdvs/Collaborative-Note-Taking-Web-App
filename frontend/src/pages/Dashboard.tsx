import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, Plus,  LogOut,  } from "lucide-react";


import { Axios } from "../utils/Axios";
import SummaryApi from "../api/SummaryApi";
import Loader from "../components/Loader";
import CreateNote from "../components/CreateNote";
import NotesPage from "./NotesPage";




const sidebarItems = [
  { key: "notes", label: "My Notes", icon: FileText },
  { key: "create", label: "Create Note", icon: Plus },
  
];

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("notes");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch logged user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await Axios({
          method: SummaryApi.getUser.method,
          url: SummaryApi.getUser.url,
        });

        if (data.success) {
          setUser(data.data);
        }

      } catch (error) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">

        <h1 className="text-2xl font-bold mb-8 text-blue-600">
          Notes App
        </h1>

        <ul className="space-y-3">

          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;

            return (
              <li
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </li>
            );
          })}

          <li
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-red-500 hover:bg-red-50"
          >
            <LogOut size={20} />
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        {activeSection === "notes" && (
          <NotesPage />
        )}

        {activeSection === "create" && (
          <CreateNote />
        )}

        

        

      </main>
    </div>
  );
};

export default Dashboard;