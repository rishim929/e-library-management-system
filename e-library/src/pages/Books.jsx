import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
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
      <h1 className="text-3xl font-bold mb-6">Book Management</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <div className="grid grid-cols-2 gap-4">

          <input
            className="border p-3 rounded"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="border p-3 rounded"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <select
            className="border p-3 rounded"
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
            className="border p-3 rounded"
            value={membershipLevel}
            onChange={(e) => setMembershipLevel(e.target.value)}
          >
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>

          <input
            type="file"
            className="border p-3 rounded"
            onChange={(e) => setPdf(e.target.files[0])}
          />

          <input
            type="file"
            className="border p-3 rounded"
            onChange={(e) => setCover(e.target.files[0])}
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSubmit}
            className="bg-green-700 text-white px-6 py-2 rounded"
          >
            {editingId ? "Update Book" : "Add Book"}
          </button>

          {editingId && (
            <button
              onClick={clearForm}
              className="bg-gray-500 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* 🔍 FILTER SECTION (NEW) */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid grid-cols-3 gap-4">

          <input
            className="border p-3 rounded"
            placeholder="🔍 Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-3 rounded"
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
            className="border p-3 rounded"
            placeholder="Filter by author..."
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
          />

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-center">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
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
                <tr key={b.id} className="border-b">
                  <td className="p-3">{b.id}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.category_name}</td>
                  <td>{b.membership_level}</td>
<td>
  <div className="flex gap-2 justify-center">
    <button
      onClick={() => handleEdit(b)}
      className="bg-blue-600 text-white px-3 py-1 rounded"
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(b.id)}
      className="bg-red-600 text-white px-3 py-1 rounded"
    >
      Delete
    </button>

    <button
      onClick={() => setPreviewBook(b)}
      className="bg-green-600 text-white px-3 py-1 rounded"
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
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    
    <div className="bg-white w-[90%] md:w-[70%] h-[90%] rounded-xl p-6 overflow-auto relative">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setPreviewBook(null)}
        className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded"
      >
        Close
      </button>

      {/* BOOK INFO */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* COVER */}
        <div className="flex justify-center">
<img
  src={
    previewBook.cover_image
      ? `http://localhost:5000/uploads/covers/${previewBook.cover_image}`
      : "https://via.placeholder.com/200"
  }
  alt="cover"
  className="h-80 object-cover rounded shadow"
/>
        </div>

        {/* DETAILS */}
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {previewBook.title}
          </h2>

          <p className="text-gray-600 mb-2">
            <b>Author:</b> {previewBook.author}
          </p>

          <p className="text-gray-600 mb-2">
            <b>Category:</b> {previewBook.category_name}
          </p>

          <p className="text-gray-600 mb-4">
            <b>Level:</b> {previewBook.membership_level}
          </p>

          {/* PDF OPEN BUTTON */}
{previewBook.pdf_file && (
  <a
    href={`http://localhost:5000/uploads/pdfs/${previewBook.pdf_file}`}
    target="_blank"
    rel="noreferrer"
    className="bg-green-700 text-white px-4 py-2 rounded"
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