import React from "react";
import { auth } from "./firebase";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingPage from "./BookingPage";
import MyBookingsPage from "./MyBookingsPage";

const UserDashboard = ({ user }) => {
    return (
        <Router>
            <div>
                <h2>Welcome to FitFlow, {user.email} 💪</h2>
                <nav>
                    <Link to="/dashboard/book">Book Slot</Link> |{" "}
                    <Link to="/dashboard/mybookings">My Bookings</Link> |{" "}
                    <button onClick={() => auth.signOut()}>Logout</button>
                </nav>
                <Routes>
                    <Route path="/dashboard/book" element={<BookingPage />} />
                    <Route path="/dashboard/mybookings" element={<MyBookingsPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default UserDashboard;
