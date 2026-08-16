import { useEffect, useState } from "react";
import AdminLayout from "../Layouts/Adminlayouts";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [membershipLevel, setMembershipLevel] = useState("basic");

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async () => {
    if (!categoryName.trim()) {
      alert("Enter category name");
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, {
          category_name: categoryName,
          membership_level: membershipLevel,
        });

        alert("Category Updated");
      } else {
        await addCategory({
          category_name: categoryName,
          membership_level: membershipLevel,
        });

        alert("Category Added");
      }

      setCategoryName("");
      setMembershipLevel("basic");
      setEditingId(null);

      loadCategories();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setCategoryName(category.category_name);
    setMembershipLevel(category.membership_level);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Category Management
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <select
            className="border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            value={membershipLevel}
            onChange={(e) => setMembershipLevel(e.target.value)}
          >
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl px-5 py-3 text-sm shadow transition"
            >
              {editingId ? "Update Category" : "Add Category"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setCategoryName("");
                  setMembershipLevel("basic");
                }}
                className="bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-xl px-4 py-3 text-sm transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search Category..."
          className="border border-slate-300 rounded-xl p-3 w-full text-sm text-slate-800 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-green-700 text-white font-bold text-sm">
            <tr>
              <th className="p-4 text-center">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4 text-center">Membership</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-sm">
            {categories
              .filter((cat) =>
                cat.category_name
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-slate-50/80 transition"
                >
                  <td className="p-4 text-center font-bold text-slate-800">
                    {cat.id}
                  </td>

                  <td className="p-4 font-extrabold text-slate-800">
                    {cat.category_name}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider ${
                        cat.membership_level === "premium"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {cat.membership_level}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default Categories;