package com.nhom8.freelance.repositories;

import com.nhom8.freelance.models.JobShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobShiftRepository extends JpaRepository<JobShift, Long> {
    List<JobShift> findByJobIdOrderByDayOfWeekAscStartTimeAsc(Long jobId);

    @Modifying
    @Query("DELETE FROM JobShift js WHERE js.job.id = :jobId")
    void deleteByJobId(@Param("jobId") Long jobId);
}
