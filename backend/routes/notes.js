import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import { Note } from "../models/models.js";

const router = express.Router();
const SECRET_KEY = "AKDDKKDFKGskdkfgerito49000002jdjsjd";

const upload = multer({ dest: "uploads/" });

// --- Middleware to check JWT ---
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("❌ No Authorization header");
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // IMPORTANT: ONLY THIS
    req.userId = decoded.userId;

    console.log("✅ Auth OK, userId =", req.userId);
    next();
  } catch (err) {
    console.error("❌ JWT error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

// --- GET all notes ---
router.get("/", authenticate, async (req, res) => {
    try {
        const notes = await Note.findAll({
            where: { userId: req.userId },
            order: [["createdAt", "DESC"]]
        });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notes" });
    }
});

// --- POST create a new note ---
router.post("/", authenticate, upload.single("attachment"), async (req, res) => {
    try {
        const { title, content, keywords } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Content is required" });
        }

        const note = await Note.create({
            userId: req.userId,
            title: title || "",
            content,
            keywords: keywords ? JSON.parse(keywords) : [],
            date: new Date(),
            attachmentPath: req.file?.path || null
        });

        res.status(201).json(note);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error creating note" });
    }
});

// --- PUT update a note ---
router.put("/:id", authenticate, upload.single("attachment"), async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);

        if (!note || note.userId !== req.userId) {
            return res.status(404).json({ message: "Note not found" });
        }

        const { title, content, keywords } = req.body;

        await note.update({
            title: title ?? note.title,
            content: content ?? note.content,
            keywords: keywords ? JSON.parse(keywords) : note.keywords,
            attachmentPath: req.file?.path || note.attachmentPath
        });

        res.json(note);
    } catch (err) {
        res.status(400).json({ message: "Error updating note" });
    }
});

// --- DELETE a note ---
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);

        if (!note || note.userId !== req.userId) {
            return res.status(404).json({ message: "Note not found" });
        }

        await note.destroy();
        res.json({ message: "Note deleted" });
    } catch {
        res.status(400).json({ message: "Error deleting note" });
    }
});

export default router;
