package com.studentproductivity.backend.controller;

import com.studentproductivity.backend.entity.Assignment;
import com.studentproductivity.backend.entity.Note;
import com.studentproductivity.backend.entity.Subject;
import com.studentproductivity.backend.repository.AssignmentRepository;
import com.studentproductivity.backend.repository.NoteRepository;
import com.studentproductivity.backend.repository.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final SubjectRepository subjectRepository;
    private final AssignmentRepository assignmentRepository;
    private final NoteRepository noteRepository;

    public DashboardController(
            SubjectRepository subjectRepository,
            AssignmentRepository assignmentRepository,
            NoteRepository noteRepository) {

        this.subjectRepository = subjectRepository;
        this.assignmentRepository = assignmentRepository;
        this.noteRepository = noteRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication authentication) {

        String email = authentication.getName();

        Long userId = subjectRepository.findUserIdByEmail(email);

        List<Subject> subjects = subjectRepository.findByUserId(userId);
        List<Assignment> assignments = assignmentRepository.findByUserId(userId);
        List<Note> notes = noteRepository.findByUserId(userId);

        long completedAssignments = assignments.stream()
                .filter(Assignment::getCompleted)
                .count();

        long pendingAssignments = assignments.size() - completedAssignments;

        Map<String, Object> stats = new HashMap<>();

        stats.put("subjects", subjects.size());
        stats.put("assignments", assignments.size());
        stats.put("completedAssignments", completedAssignments);
        stats.put("pendingAssignments", pendingAssignments);
        stats.put("notes", notes.size());

        return ResponseEntity.ok(stats);
    }
}