import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-700">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-xl">🔔</button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>

          <div>
            <h3 className="font-semibold">
              {user?.name || "Admin"}
            </h3>
            <p className="text-sm text-gray-500">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;