import { useState, useEffect } from "react";
import {
  FaMobileAlt,
  FaDesktop,
  FaWifi,
  FaSignal,
  FaBatteryFull,
  FaSyncAlt,
} from "react-icons/fa";

function AppDeviceWrapper({ children }) {
  const [viewMode, setViewMode] = useState("box");
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Check initial window width
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileDevice(isMobile);
      if (isMobile) {
        setViewMode("fullscreen");
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Live clock update for status bar
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearInterval(interval);
    };
  }, []);

  // If on a physical phone or full-screen mode selected, display children natively
  if (isMobileDevice || viewMode === "fullscreen") {
    return (
      <div className="relative min-h-screen bg-slate-900 text-slate-100">
        {!isMobileDevice && (
          <div className="fixed top-3 right-4 z-50">
            <button
              onClick={() => setViewMode("box")}
              className="bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-lg backdrop-blur flex items-center gap-2 border border-indigo-400/40 transition"
            >
              <FaMobileAlt /> Switch to App Box View
            </button>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start py-6 px-4 selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top Floating Control Bar */}
      <header className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl px-5 py-3 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xl z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md font-bold text-lg">
            📚
          </div>
          <div>
            <h1 className="font-bold text-white text-sm sm:text-base tracking-wide flex items-center gap-2">
              E-Library Management System
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                MOBILE APP ENGINE
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive Mobile App Preview Container
            </p>
          </div>
        </div>

        {/* View Mode Toggle Controls */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setViewMode("box")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === "box"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FaMobileAlt className="text-sm" />
            <span>App Box View</span>
          </button>

          <button
            onClick={() => setViewMode("fullscreen")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === "fullscreen"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FaDesktop className="text-sm" />
            <span>Expanded View</span>
          </button>
        </div>
      </header>

      {/* Smartphone App Frame Container */}
      <div className="relative group my-auto">
        {/* Ambient Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-[60px] blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>

        {/* Outer Phone Shell */}
        <div className="relative w-[380px] h-[810px] sm:w-[410px] sm:h-[860px] bg-slate-900 border-[10px] border-slate-800/95 rounded-[52px] shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden ring-1 ring-slate-700/50">
          
          {/* Top Notch / Dynamic Island */}
          <div className="bg-slate-950 pt-3 pb-2 px-6 flex items-center justify-between z-40 select-none border-b border-slate-800/40">
            {/* Live Clock */}
            <span className="text-[12px] font-bold tracking-tight text-slate-200 pl-2">
              {currentTime || "12:00"}
            </span>

            {/* Dynamic Camera Island Pill */}
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2 border border-slate-800 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900/80"></div>
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-2 text-slate-300 text-[11px] pr-2">
              <FaSignal />
              <FaWifi />
              <FaBatteryFull className="text-xs text-emerald-400" />
            </div>
          </div>

          {/* Phone Screen App Viewport */}
          <div className="flex-1 overflow-y-auto bg-slate-900 relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="bg-slate-950 py-2 flex items-center justify-center z-40 border-t border-slate-800/40">
            <div className="w-32 h-1 bg-slate-500/60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppDeviceWrapper;
