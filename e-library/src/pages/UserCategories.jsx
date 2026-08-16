import { useEffect, useState } from "react";
import UserLayout from "../Layouts/Userlayouts";
import { getCategories } from "../services/categoryService";
import { getBooks } from "../services/bookService";
import { saveReadingHistory } from "../services/readingHistoryService";
import PdfPreview from "../components/PdfPreview";
import { API_BASE_URL } from "../config";
import { FaBookOpen } from "react-icons/fa";

function UserCategories() {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [previewBook, setPreviewBook] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadCategories();
    loadBooks();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.log(err);
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

  return (
    <UserLayout>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
        📂 Categories
      </h1>

      {!selectedCategory ? (
        /* Categories Grid - 2-columns in phone app box view */
        <div className="user-categories-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
          {categories.map((category) => {
            const totalBooks = books.filter(
              (book) => book.category_name === category.category_name
            ).length;

            return (
              <div
                key={category.id}
                className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md p-5 transition duration-200 flex flex-col items-center justify-center text-center w-full min-h-[160px] overflow-hidden"
              >
                {/* Category Title - Centered, Dark Slate, Wraps Long Titles */}
                <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight leading-snug text-center break-words max-w-full">
                  {category.category_name}
                </h2>

                {/* Book Count - Centered Slate 600 */}
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-2 text-center">
                  {totalBooks} {totalBooks === 1 ? "Book" : "Books"}
                </p>

                {/* View Books Button - 100% Contained inside padding */}
                <button
                  onClick={() =>
                    setSelectedCategory(category.category_name)
                  }
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold py-2.5 px-3 rounded-xl shadow-md shadow-indigo-600/20 transition duration-200 text-center truncate"
                >
                  View Books
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-6 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 transition"
          >
            ← Back to Categories
          </button>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6">
            Category: {selectedCategory}
          </h2>

          <div className="user-books-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
            {books
              .filter(
                (book) =>
                  book.category_name === selectedCategory
              )
              .map((book) => (
                <div
                  key={book.id}
                  className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl hover:border-indigo-500/50 transition duration-300 flex flex-col max-w-[320px] sm:max-w-sm mx-auto w-full"
                >
                  <div className="h-48 sm:h-56 bg-slate-950 relative overflow-hidden flex items-center justify-center p-2">
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
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold text-white uppercase tracking-wider shadow-md ${
                        book.membership_level === "premium"
                          ? "bg-rose-600"
                          : "bg-emerald-600"
                      }`}
                    >
                      {book.membership_level === "premium" ? "Premium" : "Free Basic"}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-white leading-snug line-clamp-2">
                        {book.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1.5">
                        Author: <span className="text-slate-200 font-semibold">{book.author}</span>
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Category: <span className="text-indigo-300 font-semibold">{book.category_name}</span>
                      </p>
                    </div>

                    {book.membership_level === "premium" &&
                    user?.membership_type !== "premium" ? (
                      <div className="mt-4">
                        <button
                          onClick={() => handleOpenBook(book)}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200"
                        >
                          Preview Book
                        </button>

                        <p className="text-slate-400 text-[10px] text-center mt-1.5">
                          Free Preview (First 5 Pages) • Upgrade for full PDF
                        </p>
                      </div>
                    ) : book.pdf_file ? (
                      <button
                        onClick={() => handleOpenBook(book)}
                        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition duration-200"
                      >
                        Read Full Book
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full mt-4 bg-slate-700 text-slate-400 text-xs sm:text-sm font-semibold py-2.5 rounded-xl cursor-not-allowed"
                      >
                        PDF Not Available
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {/* PDF PREVIEW / READER MODAL */}
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

export default UserCategories;