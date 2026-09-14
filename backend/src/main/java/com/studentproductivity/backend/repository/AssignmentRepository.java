package com.studentproductivity.backend.repository;

import com.studentproductivity.backend.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByUserId(Long userId);

    List<Assignment> findByUserIdAndSubjectId(Long userId, Long subjectId);
}