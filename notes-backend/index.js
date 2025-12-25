const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key"; // keep it secret in production

app.use(cors());
app.use(bodyParser.json());

let users = {}; // for demo purposes, use a database in real projects

// Registration
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username.endsWith("@stud.ase.ro")) {
        return res.status(400).json({ message: "Must use @stud.ase.ro email" });
    }

    if (users[username]) return res.status(400).json({ message: "User exists" });

    const hash = await bcrypt.hash(password, 10);
    users[username] = { password: hash, notes: [] };
    res.json({ message: "User registered" });
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username.endsWith("@stud.ase.ro")) {
        return res.status(400).json({ message: "Must use @stud.ase.ro email" });
    }

    const user = users[username];
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});


// Get notes
app.get("/notes", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json(users[decoded.username].notes);
    } catch (e) {
        res.status(401).json({ message: "Invalid token" });
    }
});

// Add note
app.post("/notes", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const { note } = req.body;
        users[decoded.username].notes.push(note);
        res.json({ message: "Note added" });
    } catch (e) {
        res.status(401).json({ message: "Invalid token" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
