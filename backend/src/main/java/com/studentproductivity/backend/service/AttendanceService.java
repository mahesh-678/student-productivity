package com.studentproductivity.backend.service;

import com.studentproductivity.backend.entity.Attendance;
import com.studentproductivity.backend.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public Attendance createAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceByUserId(Long userId) {
        return attendanceRepository.findByUserId(userId);
    }

    public List<Attendance> getAttendanceByUserIdAndSubjectId(
            Long userId, Long subjectId) {
        return attendanceRepository.findByUserIdAndSubjectId(userId, subjectId);
    }

    public Optional<Attendance> getAttendanceById(Long id) {
        return attendanceRepository.findById(id);
    }

    public Attendance updateAttendance(Long id, Attendance updatedAttendance) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));

        attendance.setSubjectId(updatedAttendance.getSubjectId());
        attendance.setDate(updatedAttendance.getDate());
        attendance.setStatus(updatedAttendance.getStatus());

        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
}