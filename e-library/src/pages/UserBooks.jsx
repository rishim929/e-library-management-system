import { useEffect, useState } from "react";
import UserLayout from "../Layouts/Userlayouts";
import { getBooks } from "../services/bookService";
import { saveReadingHistory } from "../services/readingHistoryService";
import PdfPreview from "../components/PdfPreview";
import { API_BASE_URL } from "../config";
import { FaBookOpen } from "react-icons/fa";

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
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">📚 Available Books</h1>

      {/* Search + Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Search books..."
          className="bg-slate-800 border border-slate-700 text-white p-3.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 shadow-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="bg-slate-800 border border-slate-700 text-white p-3.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 shadow-md"
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
        <div className="text-center py-12 text-slate-400 font-semibold text-base">
          Loading catalog...
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-base">
          No books found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl hover:border-indigo-500/50 transition duration-300 flex flex-col max-w-sm mx-auto w-full"
            >
              <div className="h-72 sm:h-80 bg-slate-950 relative overflow-hidden flex items-center justify-center p-2">
                {book.cover_image ? (
                  <img
                    src={`${API_BASE_URL}/uploads/covers/${book.cover_image}`}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                    <FaBookOpen className="text-4xl mb-2 text-slate-600" />
                    <span>No Cover Image</span>
                  </div>
                )}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-md text-[11px] font-extrabold text-white uppercase tracking-wider shadow-md ${
                    book.membership_level === "premium"
                      ? "bg-rose-600"
                      : "bg-emerald-600"
                  }`}
                >
                  {book.membership_level === "premium" ? "Premium" : "Free Basic"}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {book.title}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1.5">
                    Author: <span className="text-slate-200 font-semibold">{book.author}</span>
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Category: <span className="text-indigo-300 font-semibold">{book.category_name}</span>
                  </p>
                </div>

                {book.membership_level === "premium" &&
                user?.membership_type !== "premium" ? (
                  <div className="mt-6">
                    <button
                      onClick={() => handleOpenBook(book)}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200"
                    >
                      Preview Book
                    </button>

                    <p className="text-slate-400 text-[11px] text-center mt-2">
                      Free Preview (First 5 Pages) • Upgrade for full PDF
                    </p>
                  </div>
                ) : book.pdf_file ? (
                  <button
                    onClick={() => handleOpenBook(book)}
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition duration-200"
                  >
                    Read Full Book
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full mt-6 bg-slate-700 text-slate-400 text-xs sm:text-sm font-semibold py-3 rounded-xl cursor-not-allowed"
                  >
                    PDF Not Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF PREVIEW MODAL */}
      {previewBook && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[90vh] rounded-2xl p-4 sm:p-6 overflow-hidden flex flex-col relative shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800 pr-12">
              <div className="overflow-hidden">
                <h2 className="text-base sm:text-xl font-bold text-white truncate">
                  {previewBook.title}
                </h2>
                <p className="text-xs text-slate-400 truncate">
                  By {previewBook.author} • {previewBook.membership_level === "premium" ? "Premium Book" : "Basic Book"}
                </p>
              </div>
              {previewBook.pdf_file && (user?.membership_type === "premium" || previewBook.membership_level !== "premium") && (
                <a
                  href={`${API_BASE_URL}/uploads/pdfs/${previewBook.pdf_file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hidden sm:inline-block shadow"
                >
                  Open Original PDF ↗
                </a>
              )}
            </div>

            <button
              onClick={() => setPreviewBook(null)}
              className="absolute right-4 top-4 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold z-10"
            >
              Close
            </button>

            <div className="flex-1 overflow-auto bg-slate-950 rounded-xl p-2">
              <PdfPreview
                pdfUrl={`${API_BASE_URL}/uploads/pdfs/${previewBook.pdf_file}`}
                isPremium={previewBook.membership_level === "premium"}
                hasSubscription={user?.membership_type === "premium"}
              />
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}

export default UserBooks;