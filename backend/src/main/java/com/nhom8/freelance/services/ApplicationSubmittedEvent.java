package com.nhom8.freelance.services;

public record ApplicationSubmittedEvent(
        Long applicationId,
        Long jobId,
        String studentEmail,
        String studentName,
        String jobTitle,
        String employerName
) {}
