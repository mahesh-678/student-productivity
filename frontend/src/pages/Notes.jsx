import { useEffect, useState } from "react";
import apiFetch from "../services/api";

function Notes() {
    const [notes, setNotes] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [subjectId, setSubjectId] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editSubjectId, setEditSubjectId] = useState("");

    const fetchNotes = async () => {
        const response = await apiFetch("/notes");

        if (response && response.ok) {
            const data = await response.json();
            setNotes(data);
        }
    };

    const fetchSubjects = async () => {
        const response = await apiFetch("/subjects");

        if (response && response.ok) {
            const data = await response.json();
            setSubjects(data);
        }
    };

    useEffect(() => {
        fetchNotes();
        fetchSubjects();
    }, []);

    const addNote = async (e) => {
        e.preventDefault();

        const response = await apiFetch("/notes", {
            method: "POST",
            body: JSON.stringify({
                title,
                content,
                subjectId: subjectId
                    ? Number(subjectId)
                    : null,
            }),
        });

        if (response && response.ok) {
            setTitle("");
            setContent("");
            setSubjectId("");
            fetchNotes();
        }
    };

    const startEditing = (note) => {
        setEditingId(note.id);
        setEditTitle(note.title);
        setEditContent(note.content);
        setEditSubjectId(note.subjectId || "");
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
        setEditSubjectId("");
    };

    const updateNote = async (id) => {
        const response = await apiFetch(`/notes/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: editTitle,
                content: editContent,
                subjectId: editSubjectId
                    ? Number(editSubjectId)
                    : null,
            }),
        });

        if (response && response.ok) {
            cancelEditing();
            fetchNotes();
        }
    };

    const deleteNote = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmed) {
            return;
        }

        const response = await apiFetch(`/notes/${id}`, {
            method: "DELETE",
        });

        if (response && response.ok) {
            fetchNotes();
        }
    };

    const getSubjectName = (id) => {
        if (!id) {
            return "General";
        }

        const subject = subjects.find(
            (subject) => subject.id === id
        );

        return subject
            ? subject.name
            : "Unknown Subject";
    };

    return (
        <div className="notes-page">

            <h1>My Notes</h1>

            <form onSubmit={addNote}>

                <input
                    type="text"
                    placeholder="Note title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                >
                    <option value="">General Note</option>

                    {subjects.map((subject) => (
                        <option
                            key={subject.id}
                            value={subject.id}
                        >
                            {subject.name}
                        </option>
                    ))}
                </select>

                <textarea
                    placeholder="Write your note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="8"
                    required
                />

                <button type="submit">
                    Add Note
                </button>

            </form>

            <div className="notes-list">

                {notes.map((note) => (

                    <div
                        className="note-card"
                        key={note.id}
                    >

                        {editingId === note.id ? (

                            <div>

                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                />

                                <select
                                    value={editSubjectId}
                                    onChange={(e) =>
                                        setEditSubjectId(e.target.value)
                                    }
                                >
                                    <option value="">
                                        General Note
                                    </option>

                                    {subjects.map((subject) => (
                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>

                                <textarea
                                    value={editContent}
                                    onChange={(e) =>
                                        setEditContent(e.target.value)
                                    }
                                    rows="8"
                                />

                                <button
                                    onClick={() =>
                                        updateNote(note.id)
                                    }
                                >
                                    Save
                                </button>

                                <button onClick={cancelEditing}>
                                    Cancel
                                </button>

                            </div>

                        ) : (

                            <div>

                                <h3>{note.title}</h3>

                                <p>
                                    Subject:{" "}
                                    {getSubjectName(note.subjectId)}
                                </p>

                                <p>{note.content}</p>

                                <button
                                    onClick={() =>
                                        startEditing(note)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteNote(note.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        )}

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Notes;