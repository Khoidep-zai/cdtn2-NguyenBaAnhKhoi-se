package com.nhom8.freelance.services;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class JobSlotsFilledEmailListener {

    private static final Logger log = LoggerFactory.getLogger(JobSlotsFilledEmailListener.class);

    private final EmailService emailService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onJobSlotsFilled(JobSlotsFilledEvent event) {
        try {
            emailService.sendJobSlotsFilledEmail(
                    event.employerEmail(),
                    event.employerName(),
                    event.jobTitle(),
                    event.filledCount()
            );
            log.info("Job slots filled email sent successfully to {} for job {}",
                    event.employerEmail(), event.jobId());
        } catch (Exception ex) {
            log.error("Failed to send job slots filled email for job {}: {}",
                    event.jobId(), ex.getMessage(), ex);
        }
    }
}
