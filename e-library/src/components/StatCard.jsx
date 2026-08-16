function StatCard({ title, value, icon, color = "text-emerald-600" }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md p-4 sm:p-5 transition duration-200 flex flex-col items-center justify-center text-center w-full min-h-[125px] overflow-hidden">
      {/* Centered Icon on Top */}
      {icon && (
        <div className="text-2xl sm:text-3xl mb-2 flex items-center justify-center">
          {icon}
        </div>
      )}

      {/* Centered Label in Middle */}
      <h4 className="text-xs sm:text-sm font-bold text-slate-600 tracking-wide leading-tight text-center max-w-full">
        {title}
      </h4>

      {/* Centered Number at Bottom */}
      <h1 className={`text-2xl sm:text-3xl font-black ${color} tracking-tight leading-none mt-2.5 text-center`}>
        {value}
      </h1>
    </div>
  );
}

export default StatCard;