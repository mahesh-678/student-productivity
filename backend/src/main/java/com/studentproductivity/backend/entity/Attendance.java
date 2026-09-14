package com.studentproductivity.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "subject_id", nullable = false)
    private Long subjectId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Boolean status;

    public Attendance() {
    }

    public Attendance(Long userId, Long subjectId,
                      LocalDate date, Boolean status) {
        this.userId = userId;
        this.subjectId = subjectId;
        this.date = date;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public LocalDate getDate() {
        return date;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}