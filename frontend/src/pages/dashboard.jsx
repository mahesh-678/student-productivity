import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../services/api";

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!token || !storedUser) {
            navigate("/login");
            return;
        }

        setUser(JSON.parse(storedUser));
        const fetchStats = async () => {
            const response = await apiFetch("/dashboard/stats");

            if (response && response.ok) {
                const data = await response.json();
                setStats(data);
            }
        };

        fetchStats();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    const [stats, setStats] = useState({
        subjects: 0,
        assignments: 0,
        completedAssignments: 0,
        pendingAssignments: 0,
        notes: 0
    });
    return (
        <div className="dashboard">

            <aside className="sidebar">

                <h2>Student Productivity</h2>

                <div className="sidebar-menu">

                    <button onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </button>

                    <button onClick={() => navigate("/subjects")}>
                        Subjects
                    </button>

                    <button onClick={() => navigate("/assignments")}>
                        Assignments
                    </button>

                    <button onClick={() => navigate("/attendance")}>
                        Attendance
                    </button>

                    <button onClick={() => navigate("/notes")}>
                        Notes
                    </button>

                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </aside>

            <main className="dashboard-content">

                {user && (
                    <>
                        <div className="dashboard-header">

                            <h1>Welcome, {user.name}!</h1>

                            <p>
                                Manage your academic activities from one place.
                            </p>

                        </div>

                        <div className="dashboard-cards">

                            <div className="dashboard-card">
                                <h3>Subjects</h3>
                                <p>{stats.subjects} subjects added</p>
                                <button onClick={() => navigate("/subjects")}>
                                    View Subjects
                                </button>
                            </div>

                            <div className="dashboard-card">
                                <h3>Assignments</h3>
                                <p>
                                    {stats.pendingAssignments} pending · {stats.completedAssignments} completed
                                </p>
                                <button onClick={() => navigate("/assignments")}>
                                    View Assignments
                                </button>
                            </div>

                            <div className="dashboard-card">
                                <h3>Attendance</h3>
                                <p>Track your attendance for each subject.</p>
                                <button onClick={() => navigate("/attendance")}>
                                    View Attendance
                                </button>
                            </div>

                            <div className="dashboard-card">
                                <h3>Notes</h3>
                                <p>{stats.notes} notes created</p>
                                <button onClick={() => navigate("/notes")}>
                                    View Notes
                                </button>
                            </div>

                        </div>
                    </>
                )}

            </main>

        </div>
    );
}

export default Dashboard;