import { BrowserRouter, Routes, Route } from "react-router-dom";

import ReadingHistory from "./pages/ReadingHistory";
import Payments from "./pages/Payments";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";

// Route Protection
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Subscriptions from "./pages/Subscriptions";
import Reports from "./pages/Reports";

// User Pages
import UserDashboard from "./pages/UserDashboard";
import UserBooks from "./pages/UserBooks";
import UserCategories from "./pages/UserCategories";
import MySubscription from "./pages/MySubscription";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/books"
          element={
            <AdminRoute>
              <Books />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <Categories />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/subscriptions"
          element={
            <AdminRoute>
              <Subscriptions />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <Payments />
            </AdminRoute>
          }
        />

        {/* ================= USER ROUTES ================= */}

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/history"
          element={
            <ProtectedRoute>
              <ReadingHistory />
            </ProtectedRoute>
          }
        />
        <Route
  path="/payment/success"
  element={
    <ProtectedRoute>
      <PaymentSuccess />
    </ProtectedRoute>
  }
/>

        <Route
          path="/user/books"
          element={
            <ProtectedRoute>
              <UserBooks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/categories"
          element={
            <ProtectedRoute>
              <UserCategories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/subscription"
          element={
            <ProtectedRoute>
              <MySubscription />
            </ProtectedRoute>
          }
        />
           <Route
  path="/user/payment"
  element={
    <ProtectedRoute>
      <Payment />
    </ProtectedRoute>
  }
/>

        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;