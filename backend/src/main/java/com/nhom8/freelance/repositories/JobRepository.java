package com.nhom8.freelance.repositories;

import com.nhom8.freelance.models.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByEmployerId(Long employerId);
    Page<Job> findByStatus(String status, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR j.category.id = :categoryId) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:workMode IS NULL OR j.workMode = :workMode)")
    Page<Job> searchJobs(@Param("keyword") String keyword,
                         @Param("categoryId") Long categoryId,
                         @Param("jobType") String jobType,
                         @Param("workMode") String workMode,
                         Pageable pageable);
}
