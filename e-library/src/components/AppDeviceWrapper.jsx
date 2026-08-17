import { useState, useEffect } from "react";
import {
  FaWifi,
  FaSignal,
  FaBatteryFull,
} from "react-icons/fa";

function AppDeviceWrapper({ children }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Live clock update for status bar
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center py-6 px-4 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      {/* Smartphone App Frame Container */}
      <div className="relative group my-auto">
        {/* Ambient Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-[60px] blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>

        {/* Outer Phone Shell */}
        <div className="relative w-[380px] h-[810px] sm:w-[410px] sm:h-[860px] bg-slate-900 border-[10px] border-slate-800/95 rounded-[52px] shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden ring-1 ring-slate-700/50">
          
          {/* Top Notch / Dynamic Island Status Bar */}
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
          <div className="flex-1 overflow-y-auto bg-slate-900 relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent app-box-container">
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
