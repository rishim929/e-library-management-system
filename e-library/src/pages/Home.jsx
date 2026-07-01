import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

          <h1 className="text-3xl font-bold text-green-700">
            E-Library
          </h1>

          <div className="flex gap-8 font-medium">
            <a href="#home" className="hover:text-green-700">Home</a>
            <a href="#books" className="hover:text-green-700">Books</a>
            <a href="#membership" className="hover:text-green-700">Membership</a>
            <a href="#about" className="hover:text-green-700">About</a>
            <a href="#contact" className="hover:text-green-700">Contact</a>
          </div>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="border border-green-700 text-green-700 px-5 py-2 rounded-lg"
            >
              Login
            </Link>

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
            Discover thousands of books from different categories.
            Read online anytime and anywhere.
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

        <div className="grid grid-cols-4 gap-8">

          {[1,2,3,4].map((book)=>(
            <div
              key={book}
              className="bg-white rounded-xl shadow hover:shadow-xl duration-300 overflow-hidden"
            >

              <div className="h-72 bg-gray-200"></div>

              <div className="p-5">

                <h3 className="font-bold text-lg">
                  Sample Book
                </h3>

                <p className="text-gray-500">
                  Author Name
                </p>

                <button
                  className="mt-5 bg-green-700 text-white px-4 py-2 rounded-lg w-full"
                >
                  View Details
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* Membership */}
      <section
        id="membership"
        className="bg-gray-100 py-20"
      >

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

                <li>✔ Read Limited Books</li>

                <li>✔ Community Access</li>

              </ul>

            </div>

            <div className="bg-white p-10 rounded-xl shadow border-4 border-green-700">

              <h3 className="text-3xl font-bold">
                Premium
              </h3>

              <p className="text-5xl mt-6 font-bold">
                Rs.499
              </p>

              <ul className="mt-8 space-y-4">

                <li>✔ Unlimited Reading</li>

                <li>✔ Download PDF</li>

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
          Our E-Library provides thousands of books for students,
          professionals, and readers worldwide. Access knowledge
          anytime from any device.
        </p>

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

          <p>Email: support@elibrary.com</p>

          <p>Phone: +977-9800000000</p>

        </div>

      </section>

    </div>
  );
}

export default Home;