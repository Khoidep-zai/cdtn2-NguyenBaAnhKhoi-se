package com.nhom8.freelance.dto.passkey;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasskeyRegisterOptionsResponse {
    private String challenge;
    private RpInfo rp;
    private UserInfo user;
    private List<PubKeyCredParam> pubKeyCredParams;
    private Long timeout;
    private String attestation;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RpInfo {
        private String name;
        private String id;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String id;
        private String name;
        private String displayName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PubKeyCredParam {
        private String type;
        private Long alg; // e.g. -7 for ES256, -257 for RS256
    }
}

