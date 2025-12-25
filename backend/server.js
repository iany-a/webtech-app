import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sequelize, Note, User } from "./models/models.js"; // make sure User model exists
import notesRouter from "./routes/notes.js";

const app = express();
const PORT = 5000;
const SECRET_KEY = "AKDDKKDFKGskdkfgerito49000002jdjsjd"; // keep secret in production

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files

// Use notesRouter for all /notes routes
app.use("/notes", notesRouter);

// ---- User registration/login ----

// Temporary in-memory users store (for demo). You can replace with DB table later
let users = {};

// Registration
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username.endsWith("@stud.ase.ro")) {
        return res.status(400).json({ message: "Must use @stud.ase.ro email" });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: "User exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });

    res.json({ message: "User registered" });
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username.endsWith("@stud.ase.ro")) {
        return res.status(400).json({ message: "Must use @stud.ase.ro email" });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

// ---- Start server and sync database ----

sequelize.sync({ alter: true })
    .then(() => {
        console.log("Database synced");
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error("Database sync error:", err));
