package com.nhom8.freelance.services;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class ApplicationSubmittedEmailListener {

    private static final Logger log = LoggerFactory.getLogger(ApplicationSubmittedEmailListener.class);

    private final EmailService emailService;

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onApplicationSubmitted(ApplicationSubmittedEvent event) {
        try {
            emailService.sendApplicationSubmittedEmailToStudent(
                    event.studentEmail(),
                    event.studentName(),
                    event.jobTitle(),
                    event.employerName()
            );
            log.info("Application submission confirmation email sent successfully to student {} for application {}",
                    event.studentEmail(), event.applicationId());
        } catch (Exception ex) {
            log.error("Failed to send application submission confirmation email to student for application {}: {}",
                    event.applicationId(), ex.getMessage(), ex);
        }
    }
}
