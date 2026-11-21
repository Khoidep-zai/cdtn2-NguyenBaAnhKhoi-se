package com.nhom8.freelance.repositories;

import com.nhom8.freelance.models.WorkHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkHistoryRepository extends JpaRepository<WorkHistory, Long> {
    List<WorkHistory> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<WorkHistory> findByStudentIdAndCompletionStatusOrderByCreatedAtDesc(Long studentId, String status);

    Optional<WorkHistory> findByApplicationId(Long applicationId);

    boolean existsByApplicationId(Long applicationId);
}
