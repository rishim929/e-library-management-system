import { useEffect, useState } from "react";
import { getBooks } from "../services/bookService";

function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  // Logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-green-700 text-white p-5 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">📚 E-Library</h1>
          <p className="text-sm">
            Welcome, {user?.name}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-white text-green-700 px-4 py-2 rounded font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Search */}
      <div className="max-w-6xl mx-auto mt-8 px-5">
        <input
          type="text"
          placeholder="Search books..."
          className="w-full border p-3 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Books */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-8 px-5 pb-10">

        {books
          .filter((book) =>
            book.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={
                  book.cover_image
                    ? `http://localhost:5000/uploads/covers/${book.cover_image}`
                    : "https://via.placeholder.com/300x400"
                }
                alt={book.title}
                className="w-full h-72 object-cover"
              />

              <div className="p-4">

                <h2 className="text-xl font-bold">
                  {book.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  <b>Author:</b> {book.author}
                </p>

                <p className="text-gray-600">
                  <b>Category:</b> {book.category_name}
                </p>

                <p className="mt-2">
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

                {/* Membership Check */}
                {book.membership_level === "premium" &&
                user?.membership_type !== "premium" ? (
                  <>
                    <button
                      disabled
                      className="w-full mt-5 bg-gray-500 text-white py-2 rounded cursor-not-allowed"
                    >
                      🔒 Premium Book
                    </button>

                    <p className="text-red-600 text-sm mt-2 text-center">
                      Upgrade your membership to access this book.
                    </p>
                  </>
                ) : book.pdf_file ? (
                  <a
                    href={`http://localhost:5000/uploads/pdfs/${book.pdf_file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center mt-5 bg-green-700 text-white py-2 rounded hover:bg-green-800"
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
    </div>
  );
}

export default UserDashboard;