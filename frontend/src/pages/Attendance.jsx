import { useEffect, useState } from "react";
import apiFetch from "../services/api";

function Attendance() {
    const [attendance, setAttendance] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [percentage, setPercentage] = useState(null);

    const [subjectId, setSubjectId] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [editSubjectId, setEditSubjectId] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editStatus, setEditStatus] = useState(true);

    const fetchSubjects = async () => {
        const response = await apiFetch("/subjects");

        if (response && response.ok) {
            const data = await response.json();
            setSubjects(data);
        }
    };

    const fetchAttendance = async () => {
        const response = await apiFetch("/attendance");

        if (response && response.ok) {
            const data = await response.json();
            setAttendance(data);
        }
    };

    const fetchPercentage = async (id) => {
        if (!id) {
            setPercentage(null);
            return;
        }

        const response = await apiFetch(
            `/attendance/subject/${id}/percentage`
        );

        if (response && response.ok) {
            const data = await response.json();
            setPercentage(data);
        }
    };

    useEffect(() => {
        fetchSubjects();
        fetchAttendance();
    }, []);

    const handleSubjectChange = (e) => {
        const id = e.target.value;

        setSubjectId(id);
        fetchPercentage(id);
    };

    const addAttendance = async (e) => {
        e.preventDefault();

        const response = await apiFetch("/attendance", {
            method: "POST",
            body: JSON.stringify({
                subjectId: Number(subjectId),
                date,
                status,
            }),
        });

        if (response && response.ok) {
            setSubjectId("");
            setDate("");
            setStatus(true);
            setPercentage(null);

            fetchAttendance();
        }
    };

    const startEditing = (record) => {
        setEditingId(record.id);
        setEditSubjectId(record.subjectId);
        setEditDate(record.date);
        setEditStatus(record.status);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditSubjectId("");
        setEditDate("");
        setEditStatus(true);
    };

    const updateAttendance = async (id) => {
        const response = await apiFetch(`/attendance/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                subjectId: Number(editSubjectId),
                date: editDate,
                status: editStatus,
            }),
        });

        if (response && response.ok) {
            cancelEditing();
            fetchAttendance();

            if (subjectId) {
                fetchPercentage(subjectId);
            }
        }
    };

    const deleteAttendance = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this attendance record?"
        );

        if (!confirmed) {
            return;
        }

        const response = await apiFetch(`/attendance/${id}`, {
            method: "DELETE",
        });

        if (response && response.ok) {
            fetchAttendance();

            if (subjectId) {
                fetchPercentage(subjectId);
            }
        }
    };

    const getSubjectName = (id) => {
        const subject = subjects.find(
            (subject) => subject.id === id
        );

        return subject ? subject.name : "Unknown Subject";
    };

    return (
        <div className="attendance-page">

            <h1>My Attendance</h1>

            <form onSubmit={addAttendance}>

                <select
                    value={subjectId}
                    onChange={handleSubjectChange}
                    required
                >
                    <option value="">Select Subject</option>

                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value === "true")
                    }
                >
                    <option value="true">Present</option>
                    <option value="false">Absent</option>
                </select>

                <button type="submit">
                    Add Attendance
                </button>

            </form>

            {percentage !== null && (
                <div className="attendance-percentage">
                    <h2>
                        Attendance: {percentage.toFixed(2)}%
                    </h2>
                </div>
            )}

            <div className="attendance-list">

                {attendance.map((record) => (

                    <div
                        className="attendance-card"
                        key={record.id}
                    >

                        {editingId === record.id ? (

                            <div>

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

                                <input
                                    type="date"
                                    value={editDate}
                                    onChange={(e) =>
                                        setEditDate(e.target.value)
                                    }
                                />

                                <select
                                    value={editStatus}
                                    onChange={(e) =>
                                        setEditStatus(
                                            e.target.value === "true"
                                        )
                                    }
                                >
                                    <option value="true">
                                        Present
                                    </option>

                                    <option value="false">
                                        Absent
                                    </option>
                                </select>

                                <button
                                    onClick={() =>
                                        updateAttendance(record.id)
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

                                <h3>
                                    {getSubjectName(record.subjectId)}
                                </h3>

                                <p>
                                    Date: {record.date}
                                </p>

                                <p>
                                    Status:{" "}
                                    {record.status
                                        ? "Present"
                                        : "Absent"}
                                </p>

                                <button
                                    onClick={() =>
                                        startEditing(record)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteAttendance(record.id)
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

export default Attendance;