package com.studentproductivity.backend.controller;

import com.studentproductivity.backend.entity.Subject;
import com.studentproductivity.backend.service.SubjectService;
import com.studentproductivity.backend.repository.UserRepository;
import com.studentproductivity.backend.entity.User;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;
    private final UserRepository userRepository;

    public SubjectController(SubjectService subjectService,
                             UserRepository userRepository) {
        this.subjectService = subjectService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Subject> createSubject(
            @RequestBody Subject subject,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        subject.setUserId(user.getId());

        return ResponseEntity.ok(subjectService.createSubject(subject));
    }

    @GetMapping
    public ResponseEntity<List<Subject>> getSubjects(
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                subjectService.getSubjectsByUserId(user.getId())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubject(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return subjectService.getSubjectById(id)
                .filter(subject -> subject.getUserId().equals(user.getId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(
            @PathVariable Long id,
            @RequestBody Subject updatedSubject,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subject existingSubject = subjectService.getSubjectById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (!existingSubject.getUserId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                subjectService.updateSubject(id, updatedSubject)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subject subject = subjectService.getSubjectById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (!subject.getUserId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        subjectService.deleteSubject(id);

        return ResponseEntity.noContent().build();
    }
}