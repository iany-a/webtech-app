import NoteItem from "./NoteItem.jsx";
import React from "react";
import ReactMarkdown from "react-markdown";

export default function NoteList({ notes, onEdit, onDelete }) {
    return (
        <div className="notes-content">
            {notes.length === 0 && <p>No notes found.</p>}

            {notes.map((note) => (
                <div key={note.id} className="note-card">
                    {note.title && <h3>{note.title}</h3>}

                    {/* Markdown content */}
                    <ReactMarkdown>{note.content}</ReactMarkdown>

                    {/* Keywords / labels */}
                    {note.keywords && note.keywords.length > 0 && (
                        <p style={{ fontStyle: "italic", color: "#666" }}>
                            Keywords: {note.keywords.join(", ")}
                        </p>
                    )}

                    {/* Attachments */}
                    {note.attachmentPath && (
                        <div>
                            <img
                                src={`http://localhost:5000/${note.attachmentPath}`}
                                alt="Attachment"
                                style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover", borderRadius: "4px" }}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ marginTop: "10px" }}>
                        <button onClick={() => onEdit(note)} style={{ marginRight: "5px" }}>
                            Edit
                        </button>
                        <button onClick={() => onDelete(note.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
