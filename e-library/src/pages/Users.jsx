import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import AdminLayout from "../Layouts/Adminlayouts";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();

      console.log("Users:", res.data);

      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
      }
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Membership</th>
              <th className="p-3 border">Preferred Category</th>
              <th className="p-3 border">Created At</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="p-3 border">{user.id}</td>
                  <td className="p-3 border">{user.name}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border">{user.role}</td>
                  <td className="p-3 border">
                    {user.membership_type || "-"}
                  </td>
                  <td className="p-3 border">
                    {user.preferred_category || "-"}
                  </td>
                  <td className="p-3 border">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default Users;