package com.studentproductivity.backend.controller;

import com.studentproductivity.backend.entity.Assignment;
import com.studentproductivity.backend.entity.User;
import com.studentproductivity.backend.repository.UserRepository;
import com.studentproductivity.backend.service.AssignmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final UserRepository userRepository;

    public AssignmentController(AssignmentService assignmentService,
                                UserRepository userRepository) {
        this.assignmentService = assignmentService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(
            @RequestBody Assignment assignment,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        assignment.setUserId(user.getId());

        return ResponseEntity.ok(
                assignmentService.createAssignment(assignment)
        );
    }

    @GetMapping
    public ResponseEntity<List<Assignment>> getAssignments(
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                assignmentService.getAssignmentsByUserId(user.getId())
        );
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Assignment>> getAssignmentsBySubject(
            @PathVariable Long subjectId,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                assignmentService
                        .getAssignmentsByUserIdAndSubjectId(
                                user.getId(), subjectId
                        )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignment(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return assignmentService.getAssignmentById(id)
                .filter(assignment ->
                        assignment.getUserId().equals(user.getId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(
            @PathVariable Long id,
            @RequestBody Assignment updatedAssignment,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Assignment existingAssignment =
                assignmentService.getAssignmentById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Assignment not found"));

        if (!existingAssignment.getUserId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                assignmentService.updateAssignment(id, updatedAssignment)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Assignment assignment =
                assignmentService.getAssignmentById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Assignment not found"));

        if (!assignment.getUserId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        assignmentService.deleteAssignment(id);

        return ResponseEntity.noContent().build();
    }
}