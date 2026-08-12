import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../services/bookService";
import PdfPreview from "../components/PdfPreview";
import { API_BASE_URL } from "../config";

function Home() {
  const [books, setBooks] = useState([]);
  const [previewBook, setPreviewBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}

      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

          <h1 className="text-3xl font-bold text-green-700">
            E-Library
          </h1>

          <div className="flex gap-8 font-medium">
            <a href="#home">Home</a>
            <a href="#books">Books</a>
            <a href="#membership">Membership</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="flex gap-3">


            <Link
              to="/register"
              className="bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              Subscribe
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero */}

      <section
        id="home"
        className="bg-green-700 text-white py-24"
      >
        <div className="max-w-7xl mx-auto px-8">

          <h1 className="text-6xl font-bold mb-6">
            Welcome to E-Library
          </h1>

          <p className="text-xl max-w-2xl mb-10">
"Access a world-class digital collection spanning every genre and discipline - built for readers, students, and professionals who value convenience and quality."
          </p>

          <div className="flex gap-5">

            <Link
              to="/library"
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold"
            >
              Browse Books
            </Link>

            <Link
              to="/register"
              className="border border-white px-8 py-4 rounded-lg"
            >
              Get Subscription
            </Link>

          </div>

        </div>
      </section>

      {/* Featured Books */}

      <section
        id="books"
        className="max-w-7xl mx-auto py-20 px-8"
      >

        <h2 className="text-4xl font-bold mb-10">
          Featured Books
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <div className="grid grid-cols-4 gap-8">

            {books.map((book) => (

              <div
                key={book.id}
                className="bg-white rounded-xl shadow hover:shadow-xl overflow-hidden"
              >

                <div className="h-72 bg-gray-200">

                  {book.cover_image ? (
                    <img
                      src={`${API_BASE_URL}/uploads/covers/${book.cover_image}`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      No Cover
                    </div>
                  )}

                </div>

                <div className="p-5">

                  <h3 className="font-bold text-lg">
                    {book.title}
                  </h3>

<p className="text-gray-500">
  {book.author}
</p>

<p
  className={`mt-2 inline-block px-3 py-1 rounded text-white text-sm ${
    book.membership_level === "premium"
      ? "bg-red-500"
      : "bg-green-600"
  }`}
>
  {book.membership_level === "premium"
    ? "Premium Book"
    : "Basic Book"}
</p>

                  <button
                    onClick={() => setPreviewBook(book)}
                    className="mt-5 w-full bg-green-700 text-white py-2 rounded-lg"
                  >
{book.membership_level === "premium"
  ? "Preview Book"
  : "Read Book"}                  </button>

                </div>

              </div>

            ))}

          </div>
        )}
      </section>
            {/* Membership */}
      <section id="membership" className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Membership Plans
          </h2>

          <div className="grid grid-cols-2 gap-10">

            <div className="bg-white p-10 rounded-xl shadow">
              <h3 className="text-3xl font-bold">
                Basic
              </h3>

              <p className="text-5xl mt-6 font-bold">
                FREE
              </p>

              <ul className="mt-8 space-y-4">
                <li>✔ Browse Books</li>
                <li>✔ Read Preview (First 5 Pages)</li>
                <li>✔ Community Access</li>
              </ul>
            </div>

            <div className="bg-white p-10 rounded-xl shadow border-4 border-green-700">

              <h3 className="text-3xl font-bold">
                Premium
              </h3>

              <p className="text-5xl mt-6 font-bold">
                Rs. 20
              </p>

              <ul className="mt-8 space-y-4">
                <li>✔ Unlimited Reading</li>
                <li>✔ Full PDF Access</li>
                <li>✔ Premium Books</li>
                <li>✔ Priority Support</li>
              </ul>

              <Link
                to="/register"
                className="block text-center mt-10 bg-green-700 text-white py-4 rounded-lg"
              >
                Subscribe Now
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* About */}

      <section
        id="about"
        className="py-20 max-w-7xl mx-auto px-8"
      >
        <h2 className="text-4xl font-bold mb-6">
          About Us
        </h2>

        <p className="text-lg text-gray-600 leading-8">
Welcome to our E-Library, a digital space built for curious minds and passionate readers. From academic materials to inspiring stories, we bring knowledge closer to you with convenience, quality, and ease.        </p>

      </section>

      {/* Contact */}

      <section
        id="contact"
        className="bg-green-700 text-white py-16"
      >
        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-4xl font-bold mb-5">
            Contact Us
          </h2>

          <p>Email : support@elibrary.com</p>

          <p>Phone : +9779847788045</p>

        </div>
      </section>

      {/* ================= PDF PREVIEW MODAL ================= */}

      {previewBook && (

        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

          <div className="bg-white w-[90%] h-[90%] rounded-xl p-6 overflow-auto relative">

            <button
              onClick={() => setPreviewBook(null)}
              className="absolute right-6 top-6 bg-red-600 text-white px-5 py-2 rounded-lg"
            >
              Close
            </button>

            <h2 className="text-3xl font-bold mb-6">
              {previewBook.title}
            </h2>

<PdfPreview
  pdfUrl={`${API_BASE_URL}/uploads/pdfs/${previewBook.pdf_file}`}
  isPremium={previewBook.membership_level === "premium"}
  hasSubscription={JSON.parse(localStorage.getItem("user"))?.membership_type === "premium"}
/>

          </div>

        </div>

      )}

    </div>
  );
}

export default Home;