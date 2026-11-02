
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

    @Query(
        value = "SELECT j.* FROM jobs j WHERE j.status = 'OPEN' AND " +
                "(:keyword IS NULL OR :keyword = '' OR " +
                "(LOWER(j.title) COLLATE utf8mb4_unicode_ci LIKE " +
                "(CONCAT('%', LOWER(CONVERT(:keyword USING utf8mb4)), '%') COLLATE utf8mb4_unicode_ci)) OR " +
                "(LOWER(j.description) COLLATE utf8mb4_unicode_ci LIKE " +
                "(CONCAT('%', LOWER(CONVERT(:keyword USING utf8mb4)), '%') COLLATE utf8mb4_unicode_ci))) AND " +
                "(:categoryId IS NULL OR j.category_id = :categoryId) AND " +
                "(:jobType IS NULL OR j.job_type = :jobType) AND " +
                "(:workMode IS NULL OR j.work_mode = :workMode) AND " +
                "(:province IS NULL OR j.province = :province) AND " +
                "(:studentFriendly IS NULL OR j.student_friendly = :studentFriendly) " +
                "ORDER BY j.created_at DESC",

        countQuery =
        "SELECT COUNT(*) FROM jobs j WHERE j.status = 'OPEN' AND " +
                "(:keyword IS NULL OR :keyword = '' OR " +
                "(LOWER(j.title) COLLATE utf8mb4_unicode_ci LIKE " +
                "(CONCAT('%', LOWER(CONVERT(:keyword USING utf8mb4)), '%') COLLATE utf8mb4_unicode_ci)) OR " +
                "(LOWER(j.description) COLLATE utf8mb4_unicode_ci LIKE " +
                "(CONCAT('%', LOWER(CONVERT(:keyword USING utf8mb4)), '%') COLLATE utf8mb4_unicode_ci))) AND " +
                "(:categoryId IS NULL OR j.category_id = :categoryId) AND " +
                "(:jobType IS NULL OR j.job_type = :jobType) AND " +
                "(:workMode IS NULL OR j.work_mode = :workMode) AND " +
                "(:province IS NULL OR j.province = :province) AND " +
                "(:studentFriendly IS NULL OR j.student_friendly = :studentFriendly)",

        nativeQuery = true
    )
    Page<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("jobType") String jobType,
            @Param("workMode") String workMode,
            @Param("province") String province,
            @Param("studentFriendly") Boolean studentFriendly,
            Pageable pageable
    );

    @Query("SELECT DISTINCT j.province FROM Job j " +
           "WHERE j.province IS NOT NULL AND j.status = 'OPEN' " +
           "ORDER BY j.province ASC")
    List<String> findDistinctProvinces();
}
