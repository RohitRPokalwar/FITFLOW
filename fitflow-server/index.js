// fitflow-server/index.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "rohitpokalwar95@gmail.com",
        pass: "gcmv kitn yuzi rmpo", // NOT your Gmail login, must be App Password
    },
});
app.get("/", (req, res) => {
    res.send("FitFlow Email Backend is Running");
});

app.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        await transporter.sendMail({
            from: `"FitFlow" <rohitpokalwar95@gmail.com>`,
            to,
            subject,
            text,
        });
        res.status(200).send("Email sent!");
    } catch (err) {
        console.error("❌ Email error:", err);
        res.status(500).send("Failed to send email.");
    }
});

app.listen(5000, () => {
    console.log("✅ Server running on http://localhost:5000");
});
