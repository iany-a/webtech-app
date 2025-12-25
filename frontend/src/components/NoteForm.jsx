import { useState, useEffect } from "react";

export default function NoteForm({ note, onSave }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [keywords, setKeywords] = useState("");
    const [attachment, setAttachment] = useState(null);

    // Load note into form when editing
    useEffect(() => {
        if (note) {
            setTitle(note.title || "");
            setContent(note.content || "");
            setKeywords(note.keywords?.join(", ") || "");
            setAttachment(null);
        }
    }, [note]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert("Note content cannot be empty");
            return;
        }

        const formData = new FormData();
        if (note?.id) formData.append("id", note.id);
        formData.append("title", title);
        formData.append("content", content);
        formData.append(
            "keywords",
            JSON.stringify(
                keywords
                    .split(",")
                    .map(k => k.trim())
                    .filter(Boolean)
            )
        );

        if (attachment) {
            formData.append("attachment", attachment);
        }

        onSave(formData);

        // Clear form after save (only when creating)
        if (!note) {
            setTitle("");
            setContent("");
            setKeywords("");
            setAttachment(null);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
            />

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Tab") {
                        e.preventDefault();

                        const start = e.target.selectionStart;
                        const end = e.target.selectionEnd;

                        const newValue =
                            content.substring(0, start) +
                            "\t" +
                            content.substring(end);

                        setContent(newValue);

                        // move cursor after the tab
                        setTimeout(() => {
                            e.target.selectionStart = e.target.selectionEnd = start + 1;
                        }, 0);
                    }
                }}
                placeholder="Write your note here…"
                rows={10}
            />


            <input
                type="text"
                placeholder="Keywords (comma separated, optional)"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
            />

            <input
                type="file"
                onChange={e => setAttachment(e.target.files[0])}
                style={{ marginBottom: "10px" }}
            />

            <button type="submit">
                {note ? "Update note" : "Add note"}
            </button>
        </form>
    );
}
