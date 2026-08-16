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
      setNotifications(res.data);

      const unread = await getUnreadCount();
      setCount(unread.data.count);
    } catch (err) {
      console.log("Notification Error:", err);
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
    <div className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-slate-700 hover:text-slate-900 text-lg sm:text-xl relative rounded-xl hover:bg-slate-100 transition"
            aria-label="Notifications"
          >
            🔔
            {count > 0 && (
              <span className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center shadow-sm">
                {count}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm">
                  Notifications
                </h3>
                <button
                  onClick={handleReadAll}
                  className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500 text-center">
                    No notifications
                  </p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 transition ${
                        item.is_read ? "bg-white" : "bg-indigo-50/50"
                      }`}
                    >
                      <h4 className="font-bold text-xs text-slate-800">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                        {item.message}
                      </p>
                      <small className="text-[10px] text-slate-400 mt-1 block font-medium">
                        {new Date(item.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>

          <div className="hidden sm:block">
            <h3 className="font-bold text-xs text-slate-800 leading-tight">
              {user?.name || "Admin"}
            </h3>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;