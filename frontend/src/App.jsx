import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Assignments from "./pages/Assignments";
import Attendance from "./pages/Attendance";
import Notes from "./pages/Notes";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/notes" element={<Notes />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;