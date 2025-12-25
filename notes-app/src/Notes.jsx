
import { useState } from "react";
import { getNotes, saveNotes } from "./storage";
import NoteEditor from "./NotesEditor";
import { renderMarkdown } from "./markdown";
import axios from "axios";

async function fetchNotes() {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/notes", {
    headers: { Authorization: `Bearer ${token}` }
  });
  setNotes(res.data);
}


export default function Notes({ user, onLogout }) {
    const [notes, setNotes] = useState(() => getNotes(user));
    const [editing, setEditing] = useState(null);

    function deleteNote(index) {
        const updated = notes.filter((_, i) => i !== index);
        setNotes(updated);
        saveNotes(user, updated);

    }

    function search(query) {
        setNotes(
            getNotes(user).filter(
                n => n.title.includes(query) || n.content.includes(query)
            )
        );
    }


    if (editing !== null) {
        return (
            <NoteEditor
                note={notes[editing]}
                onSave={(note) => {
                    const updated = [...notes];
                    updated[editing] = note;
                    setNotes(updated);
                    saveNotes(user, updated);
                    setEditing(null);
                }}
                onCancel={() => setEditing(null)}
            />
        );
    }

    return (
        <div>
            <h2>Welcome, {user}</h2>
            <button onClick={onLogout}>Logout</button>

            <input placeholder="Search..." onChange={e => search(e.target.value)} />
            <button onClick={() => setEditing(notes.length)}>Add Note</button>

            {notes.map((note, i) => (
                <div className="note" key={i}>
                    <h3>{note.title}</h3>
                    <small>{note.className} | {note.date}</small>
                    <div dangerouslySetInnerHTML={{
                        __html: renderMarkdown(note.content)
                    }} />

                    {note.attachments && note.attachments.map((file, idx) => (
                        <div key={idx}>
                            {file.type.startsWith("image") ? (
                                <img src={file.data} alt={file.name}
                                    style={{ maxWidth: "100%", marginTop: "10px" }}
                                />) : (<a href={file.data} download={file.name}>📎 {file.name} </a>
                            )}
                        </div>
                    ))}

                    <button onClick={() => setEditing(i)}>Edit</button>
                    <button onClick={() => deleteNote(i)}>Delete</button>
                </div>
            ))}


        </div>
    );
}
