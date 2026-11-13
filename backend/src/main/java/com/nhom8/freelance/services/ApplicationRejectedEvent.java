package com.nhom8.freelance.services;

public record ApplicationRejectedEvent(
        Long applicationId,
        String recipientEmail,
        String studentName,
        String jobTitle,
        String employerName,
        String rejectionReason
) {}
