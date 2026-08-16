import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import {
  FaBars,
  FaHome,
  FaBook,
  FaList,
  FaHistory,
  FaMoneyBill,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

function UserLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const bottomNavItems = [
    { name: "Home", path: "/user/dashboard", icon: <FaHome /> },
    { name: "Books", path: "/user/books", icon: <FaBook /> },
    { name: "Categories", path: "/user/categories", icon: <FaList /> },
    { name: "History", path: "/user/history", icon: <FaHistory /> },
    { name: "Plan", path: "/user/subscription", icon: <FaMoneyBill /> },
    { name: "Profile", path: "/user/profile", icon: <FaUser /> },
  ];

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans">
      {/* Sidebar Drawer */}
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Layout Area */}
      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/60 sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2.5 text-slate-300 hover:text-white rounded-lg bg-slate-700/50 hover:bg-slate-700 text-lg transition"
              aria-label="Open mobile menu"
            >
              <FaBars />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
                E-Library App
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">
                Welcome back, <span className="text-indigo-400 font-semibold">{user?.name || "Member"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {user?.membership_type || "Basic"} Member
            </span>

            <button
              onClick={handleLogout}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-1.5 transition shadow"
            >
              <FaSignOutAlt className="text-xs" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Sleek Mobile Bottom Navigation Bar (< 768px) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-lg border-t border-slate-700/80 z-40 px-2 py-2 flex justify-around items-center shadow-2xl">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-indigo-400 font-bold scale-105"
                    : "text-slate-400 hover:text-slate-200"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium tracking-tight">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default UserLayout;