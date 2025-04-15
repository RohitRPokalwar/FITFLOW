import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import "./BookingPage";
import { toast } from 'react-toastify';

const handleCancel = async (id) => {
    try {
        await deleteDoc(doc(db, "bookings", id));
        toast.success("Booking cancelled.");
    } catch (err) {
        toast.error("Failed to cancel booking.");
    }
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser) return;

        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("userEmail", "==", auth.currentUser.email));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userBookings = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBookings(userBookings);
        });

        return () => unsubscribe();
    }, []);

    const handleCancel = async (id) => {
        try {
            await deleteDoc(doc(db, "bookings", id));
            alert("Booking cancelled.");
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert("Failed to cancel booking.");
        }
    };

    const handleLogout = () => {
        auth.signOut();
        navigate("/");
    };
    const handleBookingPage = () => {

        navigate("/dashboard/book");
    }

    return (
        <div className="container fade-in">
            <div className="header">
                <h2>My Bookings</h2>
                <button className="logout" onClick={handleLogout}>Logout</button>
                <hr></hr>
                <button className="BookSlot" onClick={handleBookingPage}>Book A Slot</button>
            </div>
            <hr></hr>
            <h3>View Slot Bookings</h3>
            {bookings.length === 0 ? (
                <p>You have no bookings yet.</p>
            ) : (
                <ul className="booking-list">
                    {bookings.map((booking) => (
                        <li key={booking.id} className="booking-item">
                            <span>{booking.date} | {booking.slot}</span>
                            <button onClick={() => handleCancel(booking.id)}>Cancel</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyBookings;
