import { useEffect, useState } from "react";
import UserLayout from "../Layouts/Userlayouts";
import { getBooks } from "../services/bookService";
import { saveReadingHistory } from "../services/readingHistoryService";
import PdfPreview from "../components/PdfPreview";
import { API_BASE_URL } from "../config";

function UserBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [previewBook, setPreviewBook] = useState(null);

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

  const handleOpenBook = async (book) => {
    try {
      await saveReadingHistory({
        book_id: book.id,
        last_page: 1,
      });
    } catch (err) {
      console.log(err);
    }
    setPreviewBook(book);
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
                    ? `${API_BASE_URL}/uploads/covers/${book.cover_image}`
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
                      onClick={() => handleOpenBook(book)}
                      className="w-full mt-5 bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
                    >
                      Preview Book
                    </button>

                    <p className="text-gray-600 text-xs text-center mt-2 font-medium">
                      Free Preview (First 5 Pages) • Upgrade to read full book
                    </p>
                  </>
                ) : book.pdf_file ? (
                  <button
                    onClick={() => handleOpenBook(book)}
                    className="w-full mt-5 bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
                  >
                    Read Book
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full mt-5 bg-gray-400 text-white py-2 rounded cursor-not-allowed"
                  >
                    PDF Not Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= PDF PREVIEW / READER MODAL ================= */}
      {previewBook && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-[90%] h-[90%] rounded-xl p-6 overflow-auto relative">
            <div className="flex justify-between items-center mb-6 pr-16">
              <div>
                <h2 className="text-2xl font-bold">
                  {previewBook.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  By {previewBook.author} • {previewBook.membership_level === "premium" ? "Premium Book" : "Basic Book"}
                </p>
              </div>
              {previewBook.pdf_file && (user?.membership_type === "premium" || previewBook.membership_level !== "premium") && (
                <a
                  href={`${API_BASE_URL}/uploads/pdfs/${previewBook.pdf_file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
                >
                  Open Original PDF ↗
                </a>
              )}
            </div>

            <button
              onClick={() => setPreviewBook(null)}
              className="absolute right-6 top-6 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
            >
              Close
            </button>

            <PdfPreview
              pdfUrl={`${API_BASE_URL}/uploads/pdfs/${previewBook.pdf_file}`}
              isPremium={previewBook.membership_level === "premium"}
              hasSubscription={user?.membership_type === "premium"}
            />
          </div>
        </div>
      )}
    </UserLayout>
  );
}

export default UserBooks;