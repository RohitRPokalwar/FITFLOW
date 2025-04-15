import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { toast } from "react-toastify";

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success("Signup successful!");
            navigate("/");
        } catch (error) {
            console.error("Signup error:", error.code, error.message);
            toast.error(error.message || "Signup failed!");
        }
    };

    return (
        <div className="container">
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
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
                <button type="submit" className="btn">Sign Up</button>
            </form>
            <p style={{ marginTop: "1rem" }}>
                Already have an account? <a href="/">Login</a>
            </p>
        </div>
    );
};

export default SignupPage;
