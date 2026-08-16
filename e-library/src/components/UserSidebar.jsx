import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaList,
  FaMoneyBill,
  FaUser,
  FaHistory,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};

const menuItems = [
  {
    name: "Dashboard",
    path: "/user/dashboard",
    icon: <FaHome />,
  },
  {
    name: "Books",
    path: "/user/books",
    icon: <FaBook />,
  },
  {
    name: "Categories",
    path: "/user/categories",
    icon: <FaList />,
  },
  {
    name: "Reading History",
    path: "/user/history",
    icon: <FaHistory />,
  },
  {
    name: "My Subscription",
    path: "/user/subscription",
    icon: <FaMoneyBill />,
  },
  {
    name: "My Profile",
    path: "/user/profile",
    icon: <FaUser />,
  },
];

function UserSidebar({ isOpen, onClose }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-64 bg-blue-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col shadow-2xl md:shadow-none`}
      >
        <div className="p-6 border-b border-blue-800 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
              <span>📚</span> E-Library
            </h1>
            <p className="text-xs text-blue-300 mt-1 uppercase font-semibold">
              Member App Portal
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-blue-200 hover:text-white p-2 text-xl"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* User Info Tag */}
        <div className="px-6 py-4 bg-blue-950/60 flex items-center gap-3 border-b border-blue-800/50">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-semibold text-sm truncate">{user?.name || "User"}</h4>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-800 text-blue-200 font-medium inline-block uppercase">
              {user?.membership_type || "Basic"} Plan
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 mt-4 overflow-y-auto px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-blue-200 hover:bg-blue-800/70 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-left text-red-200 hover:bg-red-600 hover:text-white transition-colors duration-200 text-sm font-semibold"
          >
            <FaSignOutAlt className="text-base" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default UserSidebar;