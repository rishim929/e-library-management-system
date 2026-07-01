import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaList,
  FaUsers,
  FaMoneyBill,
  FaChartBar,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
  { name: "Books", path: "/admin/books", icon: <FaBook /> },
  { name: "Categories", path: "/admin/categories", icon: <FaList /> },
  { name: "Users", path: "/admin/users", icon: <FaUsers /> },
  { name: "Subscriptions", path: "/admin/subscriptions", icon: <FaMoneyBill /> },
  { name: "Reports", path: "/admin/reports", icon: <FaChartBar /> },
];

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-green-800 text-white fixed left-0 top-0">
      <div className="p-6 text-center border-b border-green-700">
        <h1 className="text-2xl font-bold">📚 E-Library</h1>
        <p className="text-sm text-green-200 mt-2">Admin Panel</p>
      </div>

      <div className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 transition ${
                isActive
                  ? "bg-green-600"
                  : "hover:bg-green-700"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;