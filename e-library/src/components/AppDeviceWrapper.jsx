function AppDeviceWrapper({ children }) {
  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans">
      {children}
    </div>
  );
}

export default AppDeviceWrapper;
