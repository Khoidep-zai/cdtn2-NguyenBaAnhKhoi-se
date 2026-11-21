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
public class NewApplicationEmailListener {

    private static final Logger log = LoggerFactory.getLogger(NewApplicationEmailListener.class);

    private final EmailService emailService;

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onNewApplication(NewApplicationEvent event) {
        try {
            emailService.sendNewApplicationEmailToEmployer(
                    event.employerEmail(),
                    event.employerName(),
                    event.studentName(),
                    event.studentEmail(),
                    event.jobTitle(),
                    event.university(),
                    event.major()
            );
            log.info("New application alert email sent successfully to employer {} for application {}",
                    event.employerEmail(), event.applicationId());
        } catch (Exception ex) {
            log.error("Failed to send new application email to employer for application {}: {}",
                    event.applicationId(), ex.getMessage(), ex);
        }
    }
}
