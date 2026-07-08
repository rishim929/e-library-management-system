import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaList,
  FaMoneyBill,
  FaUser,
} from "react-icons/fa";

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

function UserSidebar() {
  return (
    <div className="w-64 h-screen bg-blue-800 text-white fixed left-0 top-0">
      <div className="p-6 border-b border-blue-700 text-center">
        <h1 className="text-2xl font-bold">
          📚 E-Library
        </h1>

        <p className="text-blue-200 mt-2">
          User Panel
        </p>
      </div>

      <div className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-blue-700"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default UserSidebar;