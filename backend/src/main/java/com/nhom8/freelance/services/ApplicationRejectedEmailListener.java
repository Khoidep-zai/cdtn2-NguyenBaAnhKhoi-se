package com.nhom8.freelance.services;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class ApplicationRejectedEmailListener {

    private static final Logger log = LoggerFactory.getLogger(ApplicationRejectedEmailListener.class);

    private final EmailService emailService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onApplicationRejected(ApplicationRejectedEvent event) {
        try {
            emailService.sendApplicationRejectedEmail(
                    event.recipientEmail(),
                    event.studentName(),
                    event.jobTitle(),
                    event.employerName(),
                    event.rejectionReason()
            );
            log.info("Rejection email sent successfully to {} for application {}",
                    event.recipientEmail(), event.applicationId());
        } catch (Exception ex) {
            log.error("Failed to send rejection email for application {}: {}",
                    event.applicationId(), ex.getMessage(), ex);
        }
    }
}
