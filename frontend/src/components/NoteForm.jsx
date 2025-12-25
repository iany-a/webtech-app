import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function NoteForm({ note, onSave }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [keywords, setKeywords] = useState("");
    const [attachment, setAttachment] = useState(null);

    useEffect(() => {
        if (note) {
            setTitle(note.title || "");
            setContent(note.content || "");
            setKeywords(note.keywords?.join(", ") || "");
            setAttachment(null);
        } else {
            // ✅ RESET FORM WHEN EXITING EDIT MODE
            setTitle("");
            setContent("");
            setKeywords("");
            setAttachment(null);
        }
    }, [note]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return alert("Note content cannot be empty");

        const formData = new FormData();
        if (note?.id) formData.append("id", note.id);
        formData.append("title", title);
        formData.append("content", content);
        formData.append(
            "keywords",
            JSON.stringify(keywords.split(",").map(k => k.trim()).filter(Boolean))
        );
        if (attachment) formData.append("attachment", attachment);

        onSave(formData);

        if (!note) {
            setTitle("");
            setContent("");
            setKeywords("");
            setAttachment(null);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="note-form">
            <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Tab") {
                        e.preventDefault(); // prevent moving to next input

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
                placeholder="Write your note in Markdown..."
            />

            <input
                type="text"
                placeholder="Keywords (comma separated, optional)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
            />
            <input type="file" onChange={(e) => setAttachment(e.target.files[0])} />
            <button type="submit">{note ? "Update note" : "Add note"}</button>

            {/* Markdown Preview */}
            <div className="markdown-preview">
                <h4>Preview:</h4>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </form>
    );
}
