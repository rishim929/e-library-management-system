import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
} from "../services/notificationService";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

const loadNotifications = async () => {
  try {
    const res = await getNotifications();

    console.log("Notifications:", res.data);

    setNotifications(res.data);

    const unread = await getUnreadCount();

    console.log("Unread Count:", unread.data);

    setCount(unread.data.count);
  } catch (err) {
    console.log("Notification Error:", err);

    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Response:", err.response.data);
    }
  }
};

  const handleReadAll = async () => {
    try {
      await markAllAsRead();
      loadNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-8 relative">
      <h2 className="text-2xl font-bold text-gray-700">
        Dashboard
      </h2>

      <div className="flex items-center gap-6">

        {/* Notification */}
        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="text-2xl relative"
          >
            🔔

            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-xl border z-50">

              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-bold">
                  Notifications
                </h3>

                <button
                  onClick={handleReadAll}
                  className="text-blue-600 text-sm"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">

                {notifications.length === 0 ? (
                  <p className="p-4 text-gray-500">
                    No notifications
                  </p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 border-b ${
                        item.is_read
                          ? "bg-white"
                          : "bg-green-50"
                      }`}
                    >
                      <h4 className="font-semibold">
                        {item.title}
                      </h4>

                      <p className="text-sm text-gray-600">
                        {item.message}
                      </p>

                      <small className="text-gray-400">
                        {new Date(item.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}

              </div>
            </div>
          )}

        </div>

        {/* User */}

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "A"}
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