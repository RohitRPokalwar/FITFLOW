import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
    collection,
    onSnapshot,
    deleteDoc,
    doc,
    addDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { toast } from 'react-toastify';

const handleSlotUpdate = () => {
    toast.info("Slot options updated by Admin.");
};


const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const unsubBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBookings(data);
        });

        const unsubSlots = onSnapshot(collection(db, "availableSlots"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSlots(data);
        });

        return () => {
            unsubBookings();
            unsubSlots();
        };
    }, []);

    const handleAddSlot = async () => {
        if (!startTime || !endTime) {
            alert("Select both start and end time.");
            return;
        }

        const timeRange = `${startTime} - ${endTime}`;
        try {
            await addDoc(collection(db, "availableSlots"), {
                time: timeRange,
            });
            setStartTime("");
            setEndTime("");
        } catch (err) {
            console.error("Failed to add slot:", err);
        }
    };

    const handleDeleteSlot = async (id) => {
        await deleteDoc(doc(db, "availableSlots", id));
    };

    const handleDeleteBooking = async (id) => {
        await deleteDoc(doc(db, "bookings", id));
    };

    const handleLogout = () => {
        auth.signOut()
            .then(() => navigate("/"))
            .catch((error) => console.error("Logout error:", error));
    };

    return (
        <div className="container fade-in">
            <h2>Admin Dashboard</h2>
            <button className="logout" onClick={handleLogout}>Logout</button>

            <h3>Add Slot Range</h3>
            <div className="slot-manager">
                <label>Start Time:</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                <label>End Time:</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                <button onClick={handleAddSlot}>Add Slot</button>
            </div>

            <ul>
                {slots.map((slot) => (
                    <li key={slot.id}>
                        {slot.time}
                        <button onClick={() => handleDeleteSlot(slot.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <hr />

            <h3>All Bookings</h3>
            {bookings.length === 0 && <p>No bookings yet.</p>}
            <ul>
                {bookings.map((b) => (
                    <li key={b.id}>
                        {b.date} at {b.slot} — <strong>{b.userEmail}</strong>
                        <button onClick={() => handleDeleteBooking(b.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
