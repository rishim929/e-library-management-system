function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 w-64">
      <h4 className="text-gray-500">{title}</h4>

      <h1 className="text-3xl font-bold mt-2 text-green-700">
        {value}
      </h1>
    </div>
  );
}

export default StatCard;