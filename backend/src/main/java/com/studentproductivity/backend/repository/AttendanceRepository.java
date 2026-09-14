package com.studentproductivity.backend.repository;

import com.studentproductivity.backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByUserId(Long userId);

    List<Attendance> findByUserIdAndSubjectId(Long userId, Long subjectId);
}