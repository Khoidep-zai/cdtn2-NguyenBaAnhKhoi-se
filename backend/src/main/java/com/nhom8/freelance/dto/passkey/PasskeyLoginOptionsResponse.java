package com.nhom8.freelance.dto.passkey;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasskeyLoginOptionsResponse {
    private String challenge;
    private String rpId;
    private Long timeout;
    private String userVerification;
    private List<AllowCredential> allowCredentials;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AllowCredential {
        private String type;
        private String id;
        private List<String> transports;
    }
}

