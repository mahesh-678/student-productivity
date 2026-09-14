package com.studentproductivity.backend.repository;

import com.studentproductivity.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByUserId(Long userId);
    @Query("SELECT u.id FROM User u WHERE u.email = :email")
    Long findUserIdByEmail(@Param("email") String email);
}