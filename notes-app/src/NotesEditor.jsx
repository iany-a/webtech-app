import { useState } from "react";

export default function NoteEditor({ note = {}, onSave, onCancel }) {
    const [attachments, setAttachments] = useState(note.attachments || []);

    function handleFiles(e) {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                setAttachments(prev => [
                    ...prev,
                    {
                        name: file.name,
                        type: file.type,
                        data: reader.result
                    }
                ]);
            };
            reader.readAsDataURL(file);
        });
    }

    function removeAttachment(index) {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;

        onSave({
            title: form.title.value,
            className: form.className.value,
            tags: form.tags.value,
            content: form.content.value,
            date: new Date().toLocaleDateString(),
            attachments
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{note.title ? "Edit" : "Add"} Note</h2>

            <input name="title" defaultValue={note.title} placeholder="Title" />
            <input name="className" defaultValue={note.className} placeholder="Class" />
            <input name="tags" defaultValue={note.tags} placeholder="Tags" />

            <textarea
                name="content"
                defaultValue={note.content}
                rows="6"
                placeholder="Write markdown..."
            />

            <input type="file" multiple onChange={handleFiles} />
            {attachments.length > 0 && (
                <div>
                    <h4>Attachments</h4>

                    {attachments.map((file, idx) => (
                        <div key={idx}>
                            {file.type.startsWith("image") ? (
                                <img
                                    src={file.data}
                                    alt={file.name}
                                    style={{ maxWidth: "120px" }}
                                />
                            ) : (
                                <span>📎 {file.name}</span>
                            )}

                            <button
                                type="button"
                                onClick={() => removeAttachment(idx)}
                            >
                                ❌ Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button>Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}
