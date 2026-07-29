import UserLayout from "../Layouts/Userlayouts";
import { useEffect, useState } from "react";
import { getBooks } from "../services/bookService";
import { saveReadingHistory } from "../services/readingHistoryService";

function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

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
    }
  };

  return (
    <UserLayout>
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user?.name}
      </h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search books..."
          className="w-full border rounded-lg p-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Books */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {book.membership_level === "premium" &&
                  user?.membership_type !== "premium" ? (
                  <>
                    <button
                      disabled
                      className="w-full mt-5 bg-gray-500 text-white py-2 rounded"
                    >
                      🔒 Premium Book
                    </button>

                    <p className="text-red-600 text-sm mt-2 text-center">
                      Upgrade your membership to access this book.
                    </p>
                  </>
                ) : book.pdf_file ? (
                  <button
                    onClick={async () => {
                      try {
                        await saveReadingHistory({
                          book_id: book.id,
                          last_page: 1,
                        });

                        window.open(
                          `http://localhost:5000/uploads/pdfs/${book.pdf_file}`,
                          "_blank"
                        );
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    className="w-full mt-5 bg-green-700 text-white py-2 rounded hover:bg-green-800"
                  >
                    📖 Read Book
                  </button>
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
    </UserLayout>
  );
}

export default UserDashboard;