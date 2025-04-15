import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";
import "./styles.css";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "bookings"), where("userEmail", "==", auth.currentUser.email));
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

    return (
        <div className="container">
            <h2> My Bookings</h2>
            {bookings.map((b) => (
                <div className="card" key={b.id}>
                    <p>{b.date} at {b.time}</p>
                    <button className="btn" onClick={() => handleCancel(b.id)}>Cancel</button>
                </div>
            ))}
        </div>
    );

};

export default MyBookings;
