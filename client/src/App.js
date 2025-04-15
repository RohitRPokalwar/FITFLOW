import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import BookingPage from "./BookingPage";
import MyBookings from "./MyBookings";
import AdminDashboard from "./AdminDashboard";
import "./styles.css";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const App = () => {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard/book" element={<BookingPage />} />
          <Route path="/dashboard/mybookings" element={<MyBookings />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />

        </Routes>

        {/* ✅ Toast notifications */}
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
        />
      </>
    </Router>
  );
};

export default App;
