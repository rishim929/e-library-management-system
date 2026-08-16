import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../services/bookService";
import PdfPreview from "../components/PdfPreview";
import { API_BASE_URL } from "../config";
import { FaBars, FaTimes, FaCheck, FaBookOpen, FaCrown } from "react-icons/fa";

function Home() {
  const [books, setBooks] = useState([]);
  const [previewBook, setPreviewBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Navigation Header - ISOLATED LOGO & HAMBURGER ON MOBILE */}
      <nav className="bg-slate-800/95 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">📚</span>
            <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-wide">
              E-Library <span className="text-indigo-400 text-[10px] sm:text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 ml-1">App</span>
            </h1>
          </Link>

          {/* Desktop Nav Links (hidden strictly on screens < 1024px) */}
          <div className="hidden lg:flex items-center gap-8 font-medium text-sm text-slate-300">
            <a href="#home" className="hover:text-indigo-400 transition">Home</a>
            <a href="#books" className="hover:text-indigo-400 transition">Books</a>
            <a href="#membership" className="hover:text-indigo-400 transition">Membership</a>
            <a href="#about" className="hover:text-indigo-400 transition">About</a>
            <a href="#contact" className="hover:text-indigo-400 transition">Contact</a>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="text-slate-300 hover:text-white px-4 py-2 text-sm font-semibold transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="lg:hidden text-slate-300 hover:text-white p-2 text-xl rounded-lg bg-slate-700/60"
            aria-label="Toggle menu"
          >
            {navOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {navOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-700/60 flex flex-col space-y-3 px-2 pb-2">
            <a
              href="#home"
              onClick={() => setNavOpen(false)}
              className="text-slate-200 hover:text-indigo-400 font-medium py-1.5 text-sm"
            >
              Home
            </a>
            <a
              href="#books"
              onClick={() => setNavOpen(false)}
              className="text-slate-200 hover:text-indigo-400 font-medium py-1.5 text-sm"
            >
              Featured Books
            </a>
            <a
              href="#membership"
              onClick={() => setNavOpen(false)}
              className="text-slate-200 hover:text-indigo-400 font-medium py-1.5 text-sm"
            >
              Membership Plans
            </a>
            <a
              href="#about"
              onClick={() => setNavOpen(false)}
              className="text-slate-200 hover:text-indigo-400 font-medium py-1.5 text-sm"
            >
              About Us
            </a>
            <a
              href="#contact"
              onClick={() => setNavOpen(false)}
              className="text-slate-200 hover:text-indigo-400 font-medium py-1.5 text-sm"
            >
              Contact
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setNavOpen(false)}
                className="w-full text-center bg-slate-700 text-white py-2.5 rounded-xl font-semibold text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setNavOpen(false)}
                className="w-full text-center bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white py-12 sm:py-24 px-4 sm:px-8 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-6">
            <FaBookOpen className="text-indigo-400" /> Digital Mobile E-Library Platform
          </span>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Read Thousands of Books <br className="hidden sm:inline" /> Anywhere, Anytime.
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Access a world-class digital collection spanning academic materials, literature, and technology—built for students and avid readers on any device.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold shadow-xl shadow-indigo-600/30 transition text-sm"
            >
              Get Subscription
            </Link>

            <a
              href="#books"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-8 py-3.5 rounded-xl font-semibold transition text-sm"
            >
              Browse Books
            </a>
          </div>
        </div>
      </section>

      {/* Featured Books Section - DOUBLED CARD WIDTH HORIZONTAL CAROUSEL FOR MOBILE/APP BOX */}
      <section id="books" className="max-w-7xl mx-auto py-12 sm:py-20 px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Featured Catalog
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Swipe horizontally to browse books inside the app box →
            </p>
          </div>

          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm flex items-center gap-1">
            View All Books →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading catalog...</div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No books found.</div>
        ) : (
          /* Horizontal Touch Swipe Carousel on Mobile with Doubled Card Width (270px) */
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 px-1 scrollbar-thin scrollbar-thumb-slate-700 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="w-[270px] sm:w-auto flex-shrink-0 snap-center bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl hover:border-indigo-500/50 transition duration-300 flex flex-col"
              >
                {/* Large Book Cover Container */}
                <div className="h-64 sm:h-72 bg-slate-950 relative overflow-hidden flex items-center justify-center p-2">
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

                {/* Card Content & Full Unabbreviated Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-white leading-snug line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5">
                      Author: <span className="text-slate-200 font-semibold">{book.author}</span>
                    </p>
                    {book.category_name && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-slate-700/80 text-indigo-300 text-[10px] font-medium border border-slate-600">
                        {book.category_name}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setPreviewBook(book)}
                    className="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200"
                  >
                    {book.membership_level === "premium" ? "Preview Sample" : "Read Book"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Membership Plans Section */}
      <section id="membership" className="bg-slate-950/80 border-y border-slate-800 py-12 sm:py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Membership Plans
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Choose the plan that fits your reading goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Basic Plan */}
            <div className="bg-slate-800/90 border border-slate-700/80 p-5 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between overflow-hidden relative w-full">
              <div>
                {/* Title + FREE Badge Inline Next to Title */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <h3 className="text-xl font-extrabold text-white">Basic Reader</h3>
                  <span className="px-2.5 py-0.5 bg-slate-700/90 text-slate-200 text-[11px] font-bold uppercase rounded-md border border-slate-600 shadow-sm">
                    FREE
                  </span>
                </div>

                <div className="my-5">
                  <span className="text-4xl sm:text-5xl font-black text-white">FREE</span>
                  <span className="text-slate-400 text-xs block mt-1">Forever free access</span>
                </div>

                <ul className="space-y-3 text-sm text-slate-300 my-6 border-t border-slate-700/60 pt-5">
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-emerald-400 text-xs flex-shrink-0" />
                    <span>Browse All Categories</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-emerald-400 text-xs flex-shrink-0" />
                    <span>Read Free Basic Books</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-emerald-400 text-xs flex-shrink-0" />
                    <span>Free Preview (First 5 Pages)</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full text-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition text-sm block mt-2"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-b from-slate-800 to-indigo-950 border-2 border-indigo-500/80 p-5 sm:p-8 rounded-2xl shadow-2xl relative flex flex-col justify-between overflow-hidden w-full">
              {/* Recommended Top Badge Inside Card */}
              <span className="absolute top-3 right-3 sm:right-4 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                <FaCrown className="text-xs" /> Recommended
              </span>

              <div className="pt-4 sm:pt-0">
                {/* Title + UNLIMITED Badge Inline Next to Title */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <h3 className="text-xl font-extrabold text-white">Premium VIP</h3>
                  <span className="px-2.5 py-0.5 bg-indigo-500/40 text-indigo-200 text-[11px] font-bold uppercase rounded-md border border-indigo-400/40 shadow-sm">
                    UNLIMITED
                  </span>
                </div>

                <div className="my-5">
                  <span className="text-4xl sm:text-5xl font-black text-white">Rs. 20</span>
                  <span className="text-indigo-300 text-xs block mt-1">Full 30 Days Access</span>
                </div>

                <ul className="space-y-3 text-sm text-slate-200 my-6 border-t border-indigo-500/30 pt-5">
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-indigo-400 text-xs flex-shrink-0" />
                    <span>Unlimited Full PDF Reading</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-indigo-400 text-xs flex-shrink-0" />
                    <span>Access Premium Exclusive Books</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-indigo-400 text-xs flex-shrink-0" />
                    <span>Personalized Reading History</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-indigo-400 text-xs flex-shrink-0" />
                    <span>Instant Khalti ePayment</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/40 transition text-sm block mt-2"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
          About E-Library
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Welcome to our E-Library, a modern digital reading platform designed for students, researchers, and avid book lovers. From academic textbooks to engaging fiction, our goal is to deliver seamless digital reading directly to your mobile screen.
        </p>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 px-4 text-center text-xs sm:text-sm">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-semibold text-slate-200">E-Library Management System</p>
          <p>Email: <span className="text-indigo-400">support@elibrary.com</span> • Phone: <span className="text-indigo-400">+977 9847788045</span></p>
          <p className="text-slate-600 text-xs pt-4 border-t border-slate-900">
            © {new Date().getFullYear()} E-Library System. All rights reserved.
          </p>
        </div>
      </footer>

      {/* PDF Preview Modal */}
      {previewBook && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[90vh] rounded-2xl p-4 sm:p-6 overflow-hidden flex flex-col relative shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800 pr-12">
              <div className="overflow-hidden">
                <h2 className="text-base sm:text-xl font-bold text-white truncate">
                  {previewBook.title}
                </h2>
                <p className="text-xs text-slate-400 truncate">
                  By {previewBook.author}
                </p>
              </div>
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
                hasSubscription={JSON.parse(localStorage.getItem("user"))?.membership_type === "premium"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;