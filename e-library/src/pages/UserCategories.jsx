import { useEffect, useState } from "react";
import UserLayout from "../Layouts/Userlayouts";
import { getCategories } from "../services/categoryService";
import { getBooks } from "../services/bookService";

function UserCategories() {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
                        ? `http://localhost:5000/uploads/covers/${book.cover_image}`
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
                          disabled
                          className="w-full mt-4 bg-gray-500 text-white py-2 rounded cursor-not-allowed"
                        >
                          🔒 Premium Book
                        </button>

                        <p className="text-red-500 text-sm mt-2 text-center">
                          Upgrade your membership to read this book.
                        </p>
                      </>
                    ) : book.pdf_file ? (
                      <a
                        href={`http://localhost:5000/uploads/pdfs/${book.pdf_file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block mt-4 bg-green-700 text-white text-center py-2 rounded hover:bg-green-800"
                      >
                        📖 Read Book
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full mt-4 bg-gray-400 text-white py-2 rounded"
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
    </UserLayout>
  );
}

export default UserCategories;