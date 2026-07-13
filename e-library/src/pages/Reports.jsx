import AdminLayout from "../layouts/AdminLayout";

function Reports() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">
        Reports
      </h1>

      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Reports Dashboard
        </h2>

        <p className="text-gray-600">
          Reports will be displayed here.
        </p>
      </div>
    </AdminLayout>
  );
}

export default Reports;