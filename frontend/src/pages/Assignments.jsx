import { useEffect, useState } from "react";
import apiFetch from "../services/api";

function Assignments() {
    const [assignments, setAssignments] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [subjectId, setSubjectId] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editDeadline, setEditDeadline] = useState("");
    const [editSubjectId, setEditSubjectId] = useState("");
    const [editCompleted, setEditCompleted] = useState(false);

    const fetchAssignments = async () => {
        const response = await apiFetch("/assignments");

        if (response && response.ok) {
            const data = await response.json();
            setAssignments(data);
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
        fetchAssignments();
        fetchSubjects();
    }, []);

    const addAssignment = async (e) => {
        e.preventDefault();

        const response = await apiFetch("/assignments", {
            method: "POST",
            body: JSON.stringify({
                title,
                description,
                deadline,
                subjectId: Number(subjectId),
            }),
        });

        if (response && response.ok) {
            setTitle("");
            setDescription("");
            setDeadline("");
            setSubjectId("");
            fetchAssignments();
        }
    };

    const startEditing = (assignment) => {
        setEditingId(assignment.id);
        setEditTitle(assignment.title);
        setEditDescription(assignment.description || "");
        setEditDeadline(assignment.deadline);
        setEditSubjectId(assignment.subjectId);
        setEditCompleted(assignment.completed);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        setEditDeadline("");
        setEditSubjectId("");
        setEditCompleted(false);
    };

    const updateAssignment = async (id) => {
        const response = await apiFetch(`/assignments/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: editTitle,
                description: editDescription,
                deadline: editDeadline,
                subjectId: Number(editSubjectId),
                completed: editCompleted,
            }),
        });

        if (response && response.ok) {
            cancelEditing();
            fetchAssignments();
        }
    };

    const deleteAssignment = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this assignment?"
        );

        if (!confirmed) {
            return;
        }

        const response = await apiFetch(`/assignments/${id}`, {
            method: "DELETE",
        });

        if (response && response.ok) {
            fetchAssignments();
        }
    };

    const toggleCompleted = async (assignment) => {
        const response = await apiFetch(
            `/assignments/${assignment.id}`,
            {
                method: "PUT",
                body: JSON.stringify({
                    title: assignment.title,
                    description: assignment.description,
                    deadline: assignment.deadline,
                    subjectId: assignment.subjectId,
                    completed: !assignment.completed,
                }),
            }
        );

        if (response && response.ok) {
            fetchAssignments();
        }
    };

    const getSubjectName = (id) => {
        const subject = subjects.find(
            (subject) => subject.id === id
        );

        return subject ? subject.name : "Unknown Subject";
    };

    return (
        <div className="assignments-page">

            <h1>My Assignments</h1>

            <form onSubmit={addAssignment}>

                <input
                    type="text"
                    placeholder="Assignment title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />

                <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    required
                >
                    <option value="">Select Subject</option>

                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>

                <button type="submit">
                    Add Assignment
                </button>

            </form>

            <div className="assignments-list">

                {assignments.map((assignment) => (

                    <div
                        className="assignment-card"
                        key={assignment.id}
                    >

                        {editingId === assignment.id ? (

                            <div>

                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                />

                                <input
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) =>
                                        setEditDescription(e.target.value)
                                    }
                                />

                                <input
                                    type="datetime-local"
                                    value={editDeadline}
                                    onChange={(e) =>
                                        setEditDeadline(e.target.value)
                                    }
                                />

                                <select
                                    value={editSubjectId}
                                    onChange={(e) =>
                                        setEditSubjectId(e.target.value)
                                    }
                                >
                                    {subjects.map((subject) => (
                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editCompleted}
                                        onChange={(e) =>
                                            setEditCompleted(e.target.checked)
                                        }
                                    />

                                    Completed
                                </label>

                                <br />

                                <button
                                    onClick={() =>
                                        updateAssignment(assignment.id)
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

                                <h3>{assignment.title}</h3>

                                <p>{assignment.description}</p>

                                <p>
                                    Subject:{" "}
                                    {getSubjectName(assignment.subjectId)}
                                </p>

                                <p>
                                    Deadline:{" "}
                                    {new Date(
                                        assignment.deadline
                                    ).toLocaleString()}
                                </p>

                                <p>
                                    Status:{" "}
                                    {assignment.completed
                                        ? "Completed"
                                        : "Pending"}
                                </p>

                                <button
                                    onClick={() =>
                                        toggleCompleted(assignment)
                                    }
                                >
                                    {assignment.completed
                                        ? "Mark Pending"
                                        : "Mark Completed"}
                                </button>

                                <button
                                    onClick={() =>
                                        startEditing(assignment)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteAssignment(assignment.id)
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

export default Assignments;