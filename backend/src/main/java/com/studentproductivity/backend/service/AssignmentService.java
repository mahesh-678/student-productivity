package com.studentproductivity.backend.service;

import com.studentproductivity.backend.entity.Assignment;
import com.studentproductivity.backend.repository.AssignmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    public AssignmentService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAssignmentsByUserId(Long userId) {
        return assignmentRepository.findByUserId(userId);
    }

    public List<Assignment> getAssignmentsByUserIdAndSubjectId(
            Long userId, Long subjectId) {
        return assignmentRepository.findByUserIdAndSubjectId(userId, subjectId);
    }

    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }

    public Assignment updateAssignment(Long id, Assignment updatedAssignment) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        assignment.setTitle(updatedAssignment.getTitle());
        assignment.setDescription(updatedAssignment.getDescription());
        assignment.setDeadline(updatedAssignment.getDeadline());
        assignment.setCompleted(updatedAssignment.getCompleted());
        assignment.setSubjectId(updatedAssignment.getSubjectId());

        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
}