package com.nhom8.freelance.repositories;

import com.nhom8.freelance.models.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findAllByOrderByCreatedAtDesc();

    Page<Report> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Report> findByStatusOrderByCreatedAtDesc(String status);

    Page<Report> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    Optional<Report> findByReporterIdAndJobIdAndStatus(Long reporterId, Long jobId, String status);

    long countByStatus(String status);
}

