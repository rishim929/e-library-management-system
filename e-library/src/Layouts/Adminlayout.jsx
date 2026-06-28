import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="ml-64">
        <Navbar />

        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;