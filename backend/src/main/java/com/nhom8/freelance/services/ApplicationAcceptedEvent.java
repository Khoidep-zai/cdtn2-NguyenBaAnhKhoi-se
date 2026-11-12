package com.nhom8.freelance.services;

public record ApplicationAcceptedEvent(
        Long applicationId,
        String recipientEmail,
        String studentName,
        String jobTitle,
        String employerName
) {}
