import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaList,
  FaUsers,
  FaMoneyBill,
  FaChartBar,
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
    path: "/admin/dashboard",
    icon: <FaHome />,
  },
  {
    name: "Books",
    path: "/admin/books",
    icon: <FaBook />,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: <FaList />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <FaUsers />,
  },
  {
    name: "Subscriptions",
    path: "/admin/subscriptions",
    icon: <FaMoneyBill />,
  },
  {
    name: "Payments",
    path: "/admin/payments",
    icon: <FaMoneyBill />,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: <FaChartBar />,
  },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      <div
        className={`fixed top-0 bottom-0 left-0 w-64 bg-emerald-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col shadow-2xl md:shadow-none`}
      >
        <div className="p-6 border-b border-emerald-800 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
              <span>📚</span> E-Library
            </h1>
            <p className="text-xs text-emerald-300 mt-1 uppercase font-semibold">
              Admin Control Panel
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-emerald-200 hover:text-white p-2 text-xl"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "text-emerald-200 hover:bg-emerald-800/70 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-800">
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

export default Sidebar;