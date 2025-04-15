import React, { useState } from "react";
import { db, auth } from "./firebase";
import {
    collection,
    addDoc,
    Timestamp,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./styles.css";

const BookingPage = () => {
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");
    const navigate = useNavigate();

    const slotOptions = [
        "06:00 AM - 07:00 AM",
        "07:00 AM - 08:00 AM",
        "08:00 AM - 09:00 AM",
        "05:00 PM - 06:00 PM",
        "06:00 PM - 07:00 PM",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !slot) {
            toast.error("Please select date and slot!");
            return;
        }

        try {
            const userEmail = auth.currentUser.email;

            const q = query(
                collection(db, "bookings"),
                where("userEmail", "==", userEmail),
                where("date", "==", date)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                toast.error("You already have a booking on this date.");
                return;
            }

            await addDoc(collection(db, "bookings"), {
                userEmail,
                date,
                slot,
                createdAt: Timestamp.now(),
            });

            toast.success("💪 Slot booked successfully!", {
                icon: "🏋️",
            });

            // ✅ Send booking confirmation email
            fetch("http://localhost:5000/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: userEmail,
                    subject: "Gym Booking Confirmation - FitFlow",
                    text: `Hi ${userEmail},\n\nYour gym slot has been booked successfully for ${date} at ${slot}.\n\nThank you,\nTeam FitFlow`,
                }),
            })
                .then((res) => res.text())
                .then((data) => {
                    console.log("Email sent:", data);
                    toast.success("Confirmation email sent!");
                })
                .catch((err) => {
                    console.error("Email sending error:", err);
                    toast.error("Booking done, but email not sent.");
                });

            navigate("/dashboard/mybookings");
        } catch (err) {
            toast.error("Something went wrong!");
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h2>Book a Gym Slot</h2>
            <form onSubmit={handleSubmit}>
                <label>Select Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <label>Select Slot:</label>
                <select value={slot} onChange={(e) => setSlot(e.target.value)}>
                    <option value="">-- Select Slot --</option>
                    {slotOptions.map((s, i) => (
                        <option key={i} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                <button type="submit" className="btn">
                    Book
                </button>
            </form>
        </div>
    );
};

export default BookingPage;
