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

    Page<Job> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    List<Job> findByStatusOrderByCreatedAtDesc(String status);

    long countByStatus(String status);

    @Query(
        value = "SELECT j.* FROM jobs j WHERE j.status = 'OPEN' AND " +
                "(j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP) AND " +
                "(:keyword IS NULL OR :keyword = '' OR " +
                "(LOWER(j.title) LIKE CONCAT('%', LOWER(:keyword), '%')) OR " +
                "(LOWER(j.description) LIKE CONCAT('%', LOWER(:keyword), '%'))) AND " +
                "(:categoryId IS NULL OR j.category_id = :categoryId) AND " +
                "(:jobType IS NULL OR j.job_type = :jobType) AND " +
                "(:workMode IS NULL OR j.work_mode = :workMode) AND " +
                "(:province IS NULL OR j.province = :province) AND " +
                "(:studentFriendly IS NULL OR j.student_friendly = :studentFriendly) AND " +
                "(:shiftType IS NULL OR j.shift_type = :shiftType OR " +
                " (EXISTS (SELECT 1 FROM job_shifts js0 WHERE js0.job_id = j.id AND (" +
                "    (:shiftType = 'MORNING' AND (js0.shift_name LIKE '%Sáng%' OR (js0.start_time >= '06:00:00' AND js0.start_time < '12:00:00') OR js0.is_flexible = TRUE)) OR " +
                "    (:shiftType = 'AFTERNOON' AND (js0.shift_name LIKE '%Chiều%' OR (js0.start_time >= '12:00:00' AND js0.start_time < '18:00:00') OR js0.is_flexible = TRUE)) OR " +
                "    (:shiftType = 'EVENING' AND (js0.shift_name LIKE '%Tối%' OR js0.start_time >= '18:00:00' OR js0.start_time > js0.end_time OR js0.is_flexible = TRUE)) OR " +
                "    (:shiftType = 'FLEXIBLE' AND js0.is_flexible = TRUE)" +
                " )))) " +
                "ORDER BY j.created_at DESC",

        countQuery =
        "SELECT COUNT(*) FROM jobs j WHERE j.status = 'OPEN' AND " +
                "(j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP) AND " +
                "(:keyword IS NULL OR :keyword = '' OR " +
                "(LOWER(j.title) LIKE CONCAT('%', LOWER(:keyword), '%')) OR " +
                "(LOWER(j.description) LIKE CONCAT('%', LOWER(:keyword), '%'))) AND " +
                "(:categoryId IS NULL OR j.category_id = :categoryId) AND " +
                "(:jobType IS NULL OR j.job_type = :jobType) AND " +
                "(:workMode IS NULL OR j.work_mode = :workMode) AND " +
                "(:province IS NULL OR j.province = :province) AND " +
                "(:studentFriendly IS NULL OR j.student_friendly = :studentFriendly) AND " +
                "(:shiftType IS NULL OR j.shift_type = :shiftType OR " +
                " (EXISTS (SELECT 1 FROM job_shifts js0 WHERE js0.job_id = j.id AND (" +
                "    (:shiftType = 'MORNING' AND (js0.shift_name LIKE '%Sáng%' OR (js0.start_time >= '06:00:00' AND js0.start_time < '12:00:00') OR js0.is_flexible = TRUE)) OR " +
                "    (:shiftType = 'AFTERNOON' AND (js0.shift_name LIKE '%Chiều%' OR (js0.start_time >= '12:00:00' AND js0.start_time < '18:00:00') OR js0.is_flexible = TRUE)) OR " +
                "    (:shiftType = 'EVENING' AND (js0.shift_name LIKE '%Tối%' OR js0.start_time >= '18:00:00' OR js0.start_time > js0.end_time OR js0.is_flexible = TRUE)) OR " +
                "    (:shiftType = 'FLEXIBLE' AND js0.is_flexible = TRUE)" +
                " ))))",

        nativeQuery = true
    )
    Page<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("jobType") String jobType,
            @Param("workMode") String workMode,
            @Param("province") String province,
            @Param("studentFriendly") Boolean studentFriendly,
            @Param("shiftType") String shiftType,
            Pageable pageable
    );

    @Query(
        value = "SELECT j.* FROM jobs j WHERE j.status = 'OPEN' AND " +
                "(j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP) AND " +
                "(:keyword IS NULL OR :keyword = '' OR " +
                "(LOWER(j.title) LIKE CONCAT('%', LOWER(:keyword), '%')) OR " +
                "(LOWER(j.description) LIKE CONCAT('%', LOWER(:keyword), '%'))) AND " +
                "(:categoryId IS NULL OR j.category_id = :categoryId) AND " +
                "(:jobType IS NULL OR j.job_type = :jobType) AND " +
                "(:workMode IS NULL OR j.work_mode = :workMode) AND " +
                "(:province IS NULL OR j.province = :province) AND " +
                "(:studentFriendly IS NULL OR j.student_friendly = :studentFriendly) AND " +
                "EXISTS (" +
                "    SELECT 1 FROM job_shifts js " +
                "    WHERE js.job_id = j.id " +
                "      AND (:hasDaysFilter = 0 OR js.day_of_week IN (:daysOfWeek)) " +
                "      AND (" +
                "          :hasTimeFilter = 0 " +
                "          OR js.is_flexible = TRUE " +
                "          OR (" +
                "              (js.start_time <= js.end_time AND (" +
                "                  (:startTime <= :endTime AND js.start_time < :endTime AND js.end_time > :startTime) OR " +
                "                  (:startTime > :endTime AND (:startTime < js.end_time OR :endTime > js.start_time))" +
                "              )) OR " +
                "              (js.start_time > js.end_time AND (" +
                "                  (:startTime <= :endTime AND (:startTime < js.end_time OR :endTime > js.start_time)) OR " +
                "                  (:startTime > :endTime)" +
                "              ))" +
                "          )" +
                "      )" +
                ") " +
                "ORDER BY j.created_at DESC",

        countQuery =
        "SELECT COUNT(*) FROM jobs j WHERE j.status = 'OPEN' AND " +
                "(j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP) AND " +
                "(:keyword IS NULL OR :keyword = '' OR " +
                "(LOWER(j.title) LIKE CONCAT('%', LOWER(:keyword), '%')) OR " +
                "(LOWER(j.description) LIKE CONCAT('%', LOWER(:keyword), '%'))) AND " +
                "(:categoryId IS NULL OR j.category_id = :categoryId) AND " +
                "(:jobType IS NULL OR j.job_type = :jobType) AND " +
                "(:workMode IS NULL OR j.work_mode = :workMode) AND " +
                "(:province IS NULL OR j.province = :province) AND " +
                "(:studentFriendly IS NULL OR j.student_friendly = :studentFriendly) AND " +
                "EXISTS (" +
                "    SELECT 1 FROM job_shifts js " +
                "    WHERE js.job_id = j.id " +
                "      AND (:hasDaysFilter = 0 OR js.day_of_week IN (:daysOfWeek)) " +
                "      AND (" +
                "          :hasTimeFilter = 0 " +
                "          OR js.is_flexible = TRUE " +
                "          OR (" +
                "              (js.start_time <= js.end_time AND (" +
                "                  (:startTime <= :endTime AND js.start_time < :endTime AND js.end_time > :startTime) OR " +
                "                  (:startTime > :endTime AND (:startTime < js.end_time OR :endTime > js.start_time))" +
                "              )) OR " +
                "              (js.start_time > js.end_time AND (" +
                "                  (:startTime <= :endTime AND (:startTime < js.end_time OR :endTime > js.start_time)) OR " +
                "                  (:startTime > :endTime)" +
                "              ))" +
                "          )" +
                "      )" +
                ")",

        nativeQuery = true
    )
    Page<Job> searchJobsAdvanced(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("jobType") String jobType,
            @Param("workMode") String workMode,
            @Param("province") String province,
            @Param("studentFriendly") Boolean studentFriendly,
            @Param("hasDaysFilter") Integer hasDaysFilter,
            @Param("daysOfWeek") List<Integer> daysOfWeek,
            @Param("hasTimeFilter") Integer hasTimeFilter,
            @Param("startTime") String startTime,
            @Param("endTime") String endTime,
            Pageable pageable
    );

    @Query("SELECT DISTINCT j.province FROM Job j " +
           "WHERE j.province IS NOT NULL AND j.status = 'OPEN' " +
           "ORDER BY j.province ASC")
    List<String> findDistinctProvinces();
}
