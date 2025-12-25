import { useState, useEffect } from "react";
import Auth from "./components/Auth.jsx";
import NoteForm from "./components/NoteForm.jsx";
import NoteList from "./components/NoteList.jsx";
import axios from "axios";


export default function App() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Load notes from backend when user logs in
  useEffect(() => {
    if (token) {
      axios.get("http://localhost:5000/notes", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setNotes(res.data))
        .catch(err => console.error(err));
    }
  }, [token]);

  // Save new or edited note
  const handleSave = async (formData) => {
    try {
      const url = editingNote
        ? `http://localhost:5000/notes/${editingNote.id}`
        : "http://localhost:5000/notes";

      const method = editingNote ? "put" : "post";

      const res = await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      if (editingNote) {
        setNotes(notes.map(n => (n.id === res.data.id ? res.data : n)));
      } else {
        setNotes([...notes, res.data]);
      }

      setEditingNote(null);
    } catch (err) {
      console.error(err);
      alert("Error saving note.");
    }
  };

  const handleEdit = (note) => setEditingNote(note);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting note.");
    }
  };

  if (!user || !token) {
    return <Auth onLogin={(username, token) => {
      localStorage.setItem("user", username);
      localStorage.setItem("token", token);
      setUser(username);
      setToken(token);
    }} />;
  }

  return (
    <div className= "app-container">
      {/* Left pane: notes list */}
      <div className="notes-list">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
        />
        <NoteList
          notes={notes.filter(note => {
            const q = search.toLowerCase();
            return (
              note.title?.toLowerCase().includes(q) ||
              note.content?.toLowerCase().includes(q) ||
              note.keywords?.join(" ").toLowerCase().includes(q)
            );
          })}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Right pane: note form */}
      <div className = "editor">
        <div className = "editor-header">
          <h2>{editingNote ? "Edit Note" : "New Note"}</h2>
          <button className="logout-button" onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
          }}>Logout</button>
        </div>

        <NoteForm note={editingNote} onSave={handleSave} />
      </div>
    </div>
  );


}
