function StatCard({ title, value, icon, color = "text-emerald-600" }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md p-4 sm:p-5 transition duration-200 flex flex-col justify-between w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-600 tracking-wide leading-tight truncate">
          {title}
        </h4>
        {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
      </div>

      <div className="mt-1 flex items-baseline justify-between">
        <h1 className={`text-2xl sm:text-3xl font-black ${color} tracking-tight leading-none`}>
          {value}
        </h1>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Total
        </span>
      </div>
    </div>
  );
}

export default StatCard;