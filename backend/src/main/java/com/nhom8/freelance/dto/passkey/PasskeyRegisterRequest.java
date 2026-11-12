package com.nhom8.freelance.dto.passkey;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasskeyRegisterRequest {
    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotBlank(message = "Credential ID không được để trống")
    private String credentialId;

    private String clientDataJSON;
    private String attestationObject;
    private String rawId;
    private String nickname;
}

