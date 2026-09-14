package com.studentproductivity.backend.repository;

import com.studentproductivity.backend.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUserId(Long userId);

    List<Note> findByUserIdAndSubjectId(Long userId, Long subjectId);
}