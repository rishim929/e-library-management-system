import { useEffect, useState } from "react";
import UserLayout from "../Layouts/Userlayouts";
import { getCategories } from "../services/categoryService";
import { getBooks } from "../services/bookService";
import { saveReadingHistory } from "../services/readingHistoryService";
import PdfPreview from "../components/PdfPreview";
import { API_BASE_URL } from "../config";

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
      <h1 className="text-3xl font-bold mb-8">
        📂 Categories
      </h1>

      {!selectedCategory ? (
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const totalBooks = books.filter(
              (book) => book.category_name === category.category_name
            ).length;

            return (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold">
                  {category.category_name}
                </h2>

                <p className="text-gray-600 mt-3">
                  {totalBooks} Books
                </p>

                <button
                  onClick={() =>
                    setSelectedCategory(category.category_name)
                  }
                  className="mt-5 bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-800"
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
            className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            ← Back to Categories
          </button>

          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {books
              .filter(
                (book) =>
                  book.category_name === selectedCategory
              )
              .map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <img
                    src={
                      book.cover_image
                        ? `${API_BASE_URL}/uploads/covers/${book.cover_image}`
                        : "https://via.placeholder.com/300x400"
                    }
                    alt={book.title}
                    className="w-full h-72 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="text-xl font-bold">
                      {book.title}
                    </h3>

                    <p className="text-gray-600 mt-2">
                      Author: {book.author}
                    </p>

                    <p className="text-gray-600">
                      Membership:
                      <span
                        className={
                          book.membership_level === "premium"
                            ? " text-red-600 font-bold"
                            : " text-green-600 font-bold"
                        }
                      >
                        {" "}
                        {book.membership_level.toUpperCase()}
                      </span>
                    </p>

                    {book.membership_level === "premium" &&
                      user?.membership_type !== "premium" ? (
                      <>
                        <button
                          onClick={() => handleOpenBook(book)}
                          className="w-full mt-4 bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
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
                        className="w-full mt-4 bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
                      >
                        Read Book
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full mt-4 bg-gray-400 text-white py-2 rounded cursor-not-allowed"
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

export default UserCategories;