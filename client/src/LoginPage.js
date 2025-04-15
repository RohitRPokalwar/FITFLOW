// src/LoginPage.js
import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login successful!");
            if (email === "admin@pict.edu") {
                navigate("/dashboard/admin");
            } else {
                navigate("/dashboard/book");
            }
        } catch (err) {
            toast.error("Login failed. Please check your credentials.");
            console.error(err);
        }
    };

    const handleTestEmail = () => {
        fetch("http://localhost:5000/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: "rohitpokalwar95@gmail.com", // your test email
                subject: "📧 Test Email from FitFlow",
                text: "Hello Rohit! This is a test email from your FitFlow app.",
            }),
        })
            .then((res) => res.text())
            .then((data) => {
                toast.success("✅ Email sent!");
                console.log("✅ Response:", data);
            })
            .catch((err) => {
                toast.error("❌ Failed to send email.");
                console.error("❌ Email error:", err);
            });
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p style={{ marginTop: "1rem" }}>
                Don’t have an account? <a href="/signup">Sign up</a>
            </p>

            {/* 📧 Test Email Button */}
            <button
                onClick={handleTestEmail}
                style={{ marginTop: "1rem", backgroundColor: "#444", color: "#fff", padding: "0.5rem" }}
            >
                Send Test Email
            </button>
        </div>
    );
};

export default LoginPage;
