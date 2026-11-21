package com.nhom8.freelance.services;

public record NewApplicationEvent(
        Long applicationId,
        Long jobId,
        String employerEmail,
        String employerName,
        String studentName,
        String studentEmail,
        String jobTitle,
        String university,
        String major
) {}
