import { useEffect, useState } from "react";
import UserLayout from "../Layouts/Userlayouts";
import { getBooks } from "../services/bookService";

function UserBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(books.map((b) => b.category_name))];

  const filteredBooks = books
    .filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((book) =>
      category ? book.category_name === category : true
    );

  return (
    <UserLayout>
      <h1 className="text-3xl font-bold mb-6">📚 Available Books</h1>

      {/* Search + Filter */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search books..."
          className="border p-3 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-3 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-xl font-semibold">
          Loading books...
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 text-xl">
          No books found.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={
                  book.cover_image
                    ? `http://localhost:5000/uploads/covers/${book.cover_image}`
                    : "https://via.placeholder.com/300x400?text=No+Cover"
                }
                alt={book.title}
                className="w-full h-72 object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-bold">{book.title}</h2>

                <p className="text-gray-600 mt-2">
                  <b>Author:</b> {book.author}
                </p>

                <p className="text-gray-600">
                  <b>Category:</b> {book.category_name}
                </p>

                <p className="mt-3">
                  <b>Membership:</b>{" "}
                  <span
                    className={
                      book.membership_level === "premium"
                        ? "text-red-600 font-bold"
                        : "text-green-700 font-bold"
                    }
                  >
                    {book.membership_level.toUpperCase()}
                  </span>
                </p>

                {book.membership_level === "premium" &&
                  user?.membership_type !== "premium" ? (
                  <>
                    <button
                      disabled
                      className="w-full mt-5 bg-gray-500 text-white py-2 rounded cursor-not-allowed"
                    >
                      🔒 Premium Book
                    </button>

                    <p className="text-red-500 text-center mt-2 text-sm">
                      Upgrade your subscription to read this book.
                    </p>
                  </>
                ) : book.pdf_file ? (
                  <a
                    href={`http://localhost:5000/uploads/pdfs/${book.pdf_file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center mt-5 bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
                  >
                    📖 Read Book
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full mt-5 bg-gray-400 text-white py-2 rounded"
                  >
                    PDF Not Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  );
}

export default UserBooks;