package com.studentproductivity.backend.controller;

import com.studentproductivity.backend.entity.Attendance;
import com.studentproductivity.backend.entity.User;
import com.studentproductivity.backend.repository.UserRepository;
import com.studentproductivity.backend.service.AttendanceService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final UserRepository userRepository;

    public AttendanceController(AttendanceService attendanceService,
                                UserRepository userRepository) {
        this.attendanceService = attendanceService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Attendance> createAttendance(
            @RequestBody Attendance attendance,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        attendance.setUserId(user.getId());

        return ResponseEntity.ok(
                attendanceService.createAttendance(attendance)
        );
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAttendance(
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                attendanceService.getAttendanceByUserId(user.getId())
        );
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Attendance>> getAttendanceBySubject(
            @PathVariable Long subjectId,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                attendanceService
                        .getAttendanceByUserIdAndSubjectId(
                                user.getId(), subjectId
                        )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return attendanceService.getAttendanceById(id)
                .filter(attendance ->
                        attendance.getUserId().equals(user.getId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable Long id,
            @RequestBody Attendance updatedAttendance,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Attendance existingAttendance =
                attendanceService.getAttendanceById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Attendance not found"));

        if (!existingAttendance.getUserId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                attendanceService.updateAttendance(id, updatedAttendance)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Attendance attendance =
                attendanceService.getAttendanceById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Attendance not found"));

        if (!attendance.getUserId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        attendanceService.deleteAttendance(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/subject/{subjectId}/percentage")
    public ResponseEntity<Double> getAttendancePercentage(
            @PathVariable Long subjectId,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        double percentage = attendanceService
                .calculateAttendancePercentage(user.getId(), subjectId);

        return ResponseEntity.ok(percentage);
    }
}