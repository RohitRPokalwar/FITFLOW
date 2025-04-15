import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
    collection,
    onSnapshot,
    query,
    where,
    deleteDoc,
    doc
} from "firebase/firestore";
import "./styles.css";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // yyyy-mm-dd
    });
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

    const timeSlots = [
        "07:00 AM - 08:00 AM",
        "08:00 AM - 09:00 AM",
        "09:00 AM - 10:00 AM",
        "05:00 PM - 06:00 PM",
        "06:00 PM - 07:00 PM",
    ];

    useEffect(() => {
        if (!auth.currentUser) return;
        const q = query(
            collection(db, "bookings"),
            where("userEmail", "==", auth.currentUser.email)
        );
        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBookings(data);
        });

        return () => unsub();
    }, []);

    const handleCancel = async (id) => {
        await deleteDoc(doc(db, "bookings", id));
    };

    // Filter bookings by selected date
    const filteredBookings = bookings.filter((b) => b.date === selectedDate);

    return (
        <div className="container">
            <h2>My Bookings</h2>

            <label>Select Date:</label>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="neon-input"
            />

            <label>Select Time Slot:</label>
            <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="neon-input"
            >
                <option value="">-- Select a Time Slot --</option>
                {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                        {slot}
                    </option>
                ))}
            </select>

            <h3>Bookings for {selectedDate}</h3>
            {filteredBookings.length === 0 ? (
                <p>No bookings for selected date.</p>
            ) : (
                filteredBookings.map((b) => (
                    <div className="card" key={b.id}>
                        <p>{b.date} at {b.time}</p>
                        <button className="btn" onClick={() => handleCancel(b.id)}>Cancel</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyBookings;
