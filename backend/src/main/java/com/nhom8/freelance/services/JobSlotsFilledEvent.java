package com.nhom8.freelance.services;

public record JobSlotsFilledEvent(
        Long jobId,
        String employerEmail,
        String employerName,
        String jobTitle,
        int filledCount
) {}
