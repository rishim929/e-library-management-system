import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import AdminLayout from "../Layouts/Adminlayouts";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../services/bookService";

import { getCategories } from "../services/categoryService";

function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [membershipLevel, setMembershipLevel] = useState("basic");

  const [pdf, setPdf] = useState(null);
  const [cover, setCover] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [previewBook, setPreviewBook] = useState(null);

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadBooks();
    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!title || !author || !categoryId) {
      alert("Fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category_id", categoryId);
    formData.append("membership_level", membershipLevel);

    if (pdf) formData.append("pdf", pdf);
    if (cover) formData.append("cover", cover);

    try {
      if (editingId) {
        await updateBook(editingId, formData);
        alert("Book Updated");
      } else {
        await addBook(formData);
        alert("Book Added");
      }

      clearForm();
      loadBooks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await deleteBook(id);
      loadBooks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setCategoryId(book.category_id);
    setMembershipLevel(book.membership_level);
  };

  const clearForm = () => {
    setEditingId(null);
    setTitle("");
    setAuthor("");
    setCategoryId("");
    setMembershipLevel("basic");
    setPdf(null);
    setCover(null);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Book Management</h1>

      {/* FORM */}
      <div className="bg-slate-800 border border-slate-700 p-4 sm:p-6 rounded-2xl shadow-xl mb-8">
        <h2 className="text-lg font-bold text-white mb-4">
          {editingId ? "Edit Book" : "Add New Book"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl text-sm"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl text-sm"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <select
            className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl text-sm"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.category_name}
              </option>
            ))}
          </select>

          <select
            className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl text-sm"
            value={membershipLevel}
            onChange={(e) => setMembershipLevel(e.target.value)}
          >
            <option value="basic">Basic (Free)</option>
            <option value="premium">Premium Only</option>
          </select>

          <div>
            <label className="text-xs text-slate-400 block mb-1">PDF File</label>
            <input
              type="file"
              className="bg-slate-900 border border-slate-700 text-slate-300 p-2 rounded-xl text-xs w-full"
              onChange={(e) => setPdf(e.target.files[0])}
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Cover Image</label>
            <input
              type="file"
              className="bg-slate-900 border border-slate-700 text-slate-300 p-2 rounded-xl text-xs w-full"
              onChange={(e) => setCover(e.target.files[0])}
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition"
          >
            {editingId ? "Update Book" : "Add Book"}
          </button>

          {editingId && (
            <button
              onClick={clearForm}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-xl text-sm transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl text-sm"
            placeholder="🔍 Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl text-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.category_name}>
                {c.category_name}
              </option>
            ))}
          </select>

          <input
            className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl text-sm"
            placeholder="Filter by author..."
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300 min-w-[600px]">
          <thead className="bg-slate-900 text-slate-200 border-b border-slate-700 uppercase text-xs">
            <tr>
              <th className="p-3.5">ID</th>
              <th className="p-3.5">Title</th>
              <th className="p-3.5">Author</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Level</th>
              <th className="p-3.5 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700/60">
            {books
              .filter((b) =>
                b.title.toLowerCase().includes(search.toLowerCase())
              )
              .filter((b) =>
                filterCategory ? b.category_name === filterCategory : true
              )
              .filter((b) =>
                b.author.toLowerCase().includes(filterAuthor.toLowerCase())
              )
              .map((b) => (
                <tr key={b.id} className="hover:bg-slate-700/40 transition">
                  <td className="p-3.5 font-bold text-white">{b.id}</td>
                  <td className="p-3.5 font-semibold text-white">{b.title}</td>
                  <td className="p-3.5">{b.author}</td>
                  <td className="p-3.5">{b.category_name}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${b.membership_level === "premium" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"}`}>
                      {b.membership_level}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(b)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(b.id)}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => setPreviewBook(b)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {previewBook && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[90vh] rounded-2xl p-6 overflow-auto relative shadow-2xl">
            <button
              onClick={() => setPreviewBook(null)}
              className="absolute top-4 right-4 bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              Close
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
              <div className="flex justify-center">
                <img
                  src={
                    previewBook.cover_image
                      ? `${API_BASE_URL}/uploads/covers/${previewBook.cover_image}`
                      : "https://via.placeholder.com/200"
                  }
                  alt="cover"
                  className="h-64 object-cover rounded-xl shadow-lg border border-slate-700"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {previewBook.title}
                </h2>
                <p className="text-slate-300 text-sm mb-2">
                  <b>Author:</b> {previewBook.author}
                </p>
                <p className="text-slate-300 text-sm mb-2">
                  <b>Category:</b> {previewBook.category_name}
                </p>
                <p className="text-slate-300 text-sm mb-4">
                  <b>Level:</b> {previewBook.membership_level}
                </p>

                {previewBook.pdf_file && (
                  <a
                    href={`${API_BASE_URL}/uploads/pdfs/${previewBook.pdf_file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow"
                  >
                    Open PDF 📖
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Books;