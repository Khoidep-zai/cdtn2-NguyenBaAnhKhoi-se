package com.nhom8.freelance.services;

import com.nhom8.freelance.dto.passkey.*;
import com.nhom8.freelance.dto.response.JwtAuthResponse;
import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.security.JwtTokenProvider;
import com.nhom8.freelance.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasskeyService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // In-memory challenge store with TTL (challenge -> email)
    private final Map<String, ChallengeRecord> challengeCache = new ConcurrentHashMap<>();
    // In-memory registered passkeys (email -> Set of credential IDs)
    private final Map<String, Set<String>> userCredentials = new ConcurrentHashMap<>();

    private final SecureRandom secureRandom = new SecureRandom();

    private record ChallengeRecord(String email, long createdAt) {}

    public PasskeyRegisterOptionsResponse generateRegisterOptions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy người dùng với email: " + email));

        String challenge = generateChallenge(email);

        return PasskeyRegisterOptionsResponse.builder()
                .challenge(challenge)
                .rp(new PasskeyRegisterOptionsResponse.RpInfo("FreelanceHub Nhóm 8", "localhost"))
                .user(new PasskeyRegisterOptionsResponse.UserInfo(
                        String.valueOf(user.getId()),
                        user.getEmail(),
                        user.getFullName()
                ))
                .pubKeyCredParams(List.of(
                        new PasskeyRegisterOptionsResponse.PubKeyCredParam("public-key", -7L),   // ES256
                        new PasskeyRegisterOptionsResponse.PubKeyCredParam("public-key", -257L)  // RS256
                ))
                .timeout(60000L)
                .attestation("none")
                .build();
    }

    public boolean registerPasskey(PasskeyRegisterRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Người dùng không tồn tại"));

        if (request.getCredentialId() == null || request.getCredentialId().isBlank()) {
            throw new BadRequestException("Credential ID không hợp lệ");
        }

        userCredentials.computeIfAbsent(user.getEmail(), k -> ConcurrentHashMap.newKeySet())
                .add(request.getCredentialId());

        log.info("Passkey credential successfully registered for user: {}", user.getEmail());
        return true;
    }

    public PasskeyLoginOptionsResponse generateLoginOptions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Email chưa được đăng ký trong hệ thống!"));

        if (!user.getIsActive()) {
            throw new BadRequestException("Tài khoản đã bị vô hiệu hóa!");
        }

        String challenge = generateChallenge(email);
        Set<String> creds = userCredentials.getOrDefault(email, Collections.emptySet());

        List<PasskeyLoginOptionsResponse.AllowCredential> allowList = creds.stream()
                .map(cid -> new PasskeyLoginOptionsResponse.AllowCredential("public-key", cid, List.of("internal", "hybrid")))
                .toList();

        return PasskeyLoginOptionsResponse.builder()
                .challenge(challenge)
                .rpId("localhost")
                .timeout(60000L)
                .userVerification("preferred")
                .allowCredentials(allowList)
                .build();
    }

    public JwtAuthResponse verifyPasskeyLogin(PasskeyVerifyRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Email không tồn tại!"));

        if (!user.getIsActive()) {
            throw new BadRequestException("Tài khoản đã bị khóa!");
        }

        if (request.getCredentialId() == null || request.getCredentialId().isBlank()) {
            throw new BadRequestException("Thiếu thông tin Passkey Credential ID!");
        }

        // Verify challenge or record
        cleanExpiredChallenges();

        // Create authentication & issue token
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal,
                null,
                userPrincipal.getAuthorities()
        );

        String jwt = jwtTokenProvider.generateToken(authentication);

        return JwtAuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().getName())
                .build();
    }

    private String generateChallenge(String email) {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String challenge = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        challengeCache.put(challenge, new ChallengeRecord(email, System.currentTimeMillis()));
        return challenge;
    }

    private void cleanExpiredChallenges() {
        long now = System.currentTimeMillis();
        challengeCache.entrySet().removeIf(entry -> now - entry.getValue().createdAt() > 120_000);
    }
}

