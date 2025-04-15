import React, { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const BookingPage = () => {
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");
    const navigate = useNavigate();

    // Predefined slot options
    const slotOptions = [
        "06:00 AM - 07:00 AM",
        "07:00 AM - 08:00 AM",
        "08:00 AM - 09:00 AM",
        "05:00 PM - 06:00 PM",
        "06:00 PM - 07:00 PM"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !slot) {
            alert("Please select date and slot");
            return;
        }

        try {
            const q = query(
                collection(db, "bookings"),
                where("userEmail", "==", auth.currentUser.email),
                where("date", "==", date)
            );
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                alert("You already have a booking on this date.");
                return;
            }

            await addDoc(collection(db, "bookings"), {
                userEmail: auth.currentUser.email,
                date,
                slot,
                createdAt: Timestamp.now(),
            });
            alert("Slot booked!");
            navigate("/dashboard/mybookings");
        } catch (err) {
            alert("Something went wrong!");
            console.error(err);
        }
    };

    const handleViewBookings = () => {
        navigate("/dashboard/mybookings");
    };

    return (
        <div className="container">
            <div className="header">
                <h2>Book a Gym Slot</h2>
                <button className="view-btn" onClick={handleViewBookings}>
                    View My Bookings
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <label>Select Date:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                <label>Select Slot:</label>
                <select value={slot} onChange={(e) => setSlot(e.target.value)}>
                    <option value="">-- Select Slot --</option>
                    {slotOptions.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                    ))}
                </select>

                <button type="submit" className="btn">Book</button>
            </form>
        </div>
    );
};

export default BookingPage;
