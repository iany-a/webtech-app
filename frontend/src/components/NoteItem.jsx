import { parseMarkdown } from "../utils/markdown";

export default function NoteItem({ note, onEdit, onDelete }) {
    return (
        <div className="note-item">
            <h3>{note.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: parseMarkdown(note.content) }} />
            {note.class && <p><strong>Class:</strong> {note.class}</p>}
            {note.labels?.length > 0 && <p><strong>Labels:</strong> {note.labels.join(", ")}</p>}
            {note.keywords?.length > 0 && <p><strong>Keywords:</strong> {note.keywords.join(", ")}</p>}
            {note.date && <p><strong>Date:</strong> {new Date(note.date).toLocaleDateString()}</p>}

            {note.attachmentPath && (
                <div className="note-image">
                    <img
                        src={`http://localhost:5000/${note.attachmentPath}`}
                        alt="Attachment"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                </div>
            )}

            <div className="note-buttons">
                <button onClick={onEdit}>Edit</button>
                <button onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
}
