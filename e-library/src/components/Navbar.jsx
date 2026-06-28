function Navbar() {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-700">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-xl">🔔</button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center">
            A
          </div>

          <div>
            <h3 className="font-semibold">Admin</h3>
            <p className="text-sm text-gray-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;