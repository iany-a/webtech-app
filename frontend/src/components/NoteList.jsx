import NoteItem from "./NoteItem.jsx";

export default function NoteList({ notes, onEdit, onDelete }) {
    if (!notes || notes.length === 0) return <p>No notes yet</p>;

    return (
        <div className="note-list">
            {notes.map((note) => (
                <NoteItem
                    key={note.id}
                    note={note}
                    onEdit={() => onEdit(note)}
                    onDelete={() => onDelete(note.id)}
                />
            ))}
        </div>
    );
}
