import UserSidebar from "../components/UserSidebar";

function UserLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">

      <UserSidebar />

      <div className="ml-64">

        <div className="bg-white shadow p-5 flex justify-between items-center">

          <h2 className="text-2xl font-bold">
            User Dashboard
          </h2>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>

        </div>

        <div className="p-8">
          {children}
        </div>

      </div>
    </div>
  );
}

export default UserLayout;