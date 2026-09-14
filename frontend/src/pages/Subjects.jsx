import { useEffect, useState } from "react";
import apiFetch from "../services/api";

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [credits, setCredits] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editCode, setEditCode] = useState("");
    const [editCredits, setEditCredits] = useState("");

    const fetchSubjects = async () => {
        const response = await apiFetch("/subjects");

        if (response && response.ok) {
            const data = await response.json();
            setSubjects(data);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const addSubject = async (e) => {
        e.preventDefault();

        const response = await apiFetch("/subjects", {
            method: "POST",
            body: JSON.stringify({
                name,
                code,
                credits: Number(credits),
            }),
        });

        if (response && response.ok) {
            setName("");
            setCode("");
            setCredits("");
            fetchSubjects();
        }
    };

    const startEditing = (subject) => {
        setEditingId(subject.id);
        setEditName(subject.name);
        setEditCode(subject.code);
        setEditCredits(subject.credits);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditName("");
        setEditCode("");
        setEditCredits("");
    };

    const updateSubject = async (id) => {
        const response = await apiFetch(`/subjects/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                name: editName,
                code: editCode,
                credits: Number(editCredits),
            }),
        });

        if (response && response.ok) {
            cancelEditing();
            fetchSubjects();
        }
    };

    const deleteSubject = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this subject?"
        );

        if (!confirmed) {
            return;
        }

        const response = await apiFetch(`/subjects/${id}`, {
            method: "DELETE",
        });

        if (response && response.ok) {
            fetchSubjects();
        }
    };

    return (
        <div className="subjects-page">

            <h1>My Subjects</h1>

            <form onSubmit={addSubject}>

                <input
                    type="text"
                    placeholder="Subject name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Subject code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Credits"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    required
                />

                <button type="submit">
                    Add Subject
                </button>

            </form>

            <div className="subjects-list">

                {subjects.map((subject) => (

                    <div
                        className="subject-card"
                        key={subject.id}
                    >

                        {editingId === subject.id ? (

                            <>

                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
                                    }
                                />

                                <input
                                    type="text"
                                    value={editCode}
                                    onChange={(e) =>
                                        setEditCode(e.target.value)
                                    }
                                />

                                <input
                                    type="number"
                                    value={editCredits}
                                    onChange={(e) =>
                                        setEditCredits(e.target.value)
                                    }
                                />

                                <button
                                    onClick={() =>
                                        updateSubject(subject.id)
                                    }
                                >
                                    Save
                                </button>

                                <button onClick={cancelEditing}>
                                    Cancel
                                </button>

                            </>

                        ) : (

                            <>

                                <h3>{subject.name}</h3>

                                <p>
                                    Code: {subject.code}
                                </p>

                                <p>
                                    Credits: {subject.credits}
                                </p>

                                <button
                                    onClick={() =>
                                        startEditing(subject)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteSubject(subject.id)
                                    }
                                >
                                    Delete
                                </button>

                            </>

                        )}

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Subjects;