package com.studentproductivity.backend.controller;

import com.studentproductivity.backend.entity.Note;
import com.studentproductivity.backend.entity.User;
import com.studentproductivity.backend.repository.UserRepository;
import com.studentproductivity.backend.service.NoteService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;
    private final UserRepository userRepository;

    public NoteController(NoteService noteService,
                          UserRepository userRepository) {
        this.noteService = noteService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Note> createNote(
            @RequestBody Note note,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        note.setUserId(user.getId());

        if (note.getCreatedAt() == null) {
            note.setCreatedAt(LocalDateTime.now());
        }

        return ResponseEntity.ok(
                noteService.createNote(note)
        );
    }

    @GetMapping
    public ResponseEntity<List<Note>> getNotes(
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                noteService.getNotesByUserId(user.getId())
        );
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Note>> getNotesBySubject(
            @PathVariable Long subjectId,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                noteService.getNotesByUserIdAndSubjectId(
                        user.getId(), subjectId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNote(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return noteService.getNoteById(id)
                .filter(note ->
                        note.getUserId().equals(user.getId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(
            @PathVariable Long id,
            @RequestBody Note updatedNote,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note existingNote = noteService.getNoteById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!existingNote.getUserId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                noteService.updateNote(id, updatedNote)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = noteService.getNoteById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUserId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        noteService.deleteNote(id);

        return ResponseEntity.noContent().build();
    }
}