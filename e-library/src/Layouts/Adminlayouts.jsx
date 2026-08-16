import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaBars } from "react-icons/fa";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">
        {/* Mobile Header Bar with Hamburger */}
        <div className="md:hidden bg-slate-800 border-b border-slate-700 p-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-700/50 hover:bg-slate-700 text-lg"
              aria-label="Open mobile menu"
            >
              <FaBars />
            </button>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>📚</span> Admin Panel
            </h2>
          </div>
        </div>

        <Navbar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;