import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
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
      <h1 className="text-3xl font-bold mb-8">
        Category Management
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <div className="grid grid-cols-3 gap-4">

          <input
            className="border rounded-lg p-3"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <select
            className="border rounded-lg p-3"
            value={membershipLevel}
            onChange={(e) => setMembershipLevel(e.target.value)}
          >
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>

<div className="flex gap-2">

  <button
    onClick={handleAdd}
    className="bg-green-700 text-white rounded-lg px-4 py-2"
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
      className="bg-gray-500 text-white rounded-lg px-4 py-2"
    >
      Cancel
    </button>
  )}

</div>

        </div>

      </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
  <input
    type="text"
    placeholder="🔍 Search Category..."
    className="border rounded-lg p-3 w-full"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
      <div className="bg-white rounded-xl shadow">

        <table className="w-full">

          <thead className="bg-green-700 text-white">

            <tr>
              <th className="p-4">ID</th>
              <th>Name</th>
              <th>Membership</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {categories
  .filter((cat) =>
    cat.category_name
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .map((cat) => (

              <tr
                key={cat.id}
                className="border-b text-center"
              >

                <td className="p-4">{cat.id}</td>

                <td>{cat.category_name}</td>

                <td>{cat.membership_level}</td>

                <td>

                <div className="flex justify-center gap-2">
                  <button
                     onClick={() => handleEdit(cat)}
                     className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                   Edit
                </button>

                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
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