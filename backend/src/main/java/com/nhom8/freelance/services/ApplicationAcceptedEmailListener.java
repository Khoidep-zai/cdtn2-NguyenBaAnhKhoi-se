package com.nhom8.freelance.services;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class ApplicationAcceptedEmailListener {

    private static final Logger log = LoggerFactory.getLogger(ApplicationAcceptedEmailListener.class);

    private final EmailService emailService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onApplicationAccepted(ApplicationAcceptedEvent event) {
        try {
            emailService.sendApplicationAcceptedEmail(
                    event.recipientEmail(),
                    event.studentName(),
                    event.jobTitle(),
                    event.employerName()
            );
            log.info("Acceptance email sent successfully to {} for application {}",
                    event.recipientEmail(), event.applicationId());
        } catch (Exception ex) {
            log.error("Failed to send acceptance email for application {}: {}",
                    event.applicationId(), ex.getMessage(), ex);
        }
    }
}
