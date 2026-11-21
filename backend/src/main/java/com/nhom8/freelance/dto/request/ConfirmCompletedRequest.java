package com.nhom8.freelance.dto.request;

import lombok.Data;

@Data
public class ConfirmCompletedRequest {
    private Boolean confirmed = true;
    private Boolean isDispute = false;
    private String feedback;
    private String disputeReason;
}
