package com.nhom8.freelance.services;

import com.nhom8.freelance.dto.request.ForgotPasswordRequest;
import com.nhom8.freelance.dto.request.LoginRequest;
import com.nhom8.freelance.dto.request.RegisterRequest;
import com.nhom8.freelance.dto.request.ResetPasswordRequest;
import com.nhom8.freelance.dto.response.JwtAuthResponse;
import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.models.PasswordResetToken;
import com.nhom8.freelance.models.Role;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.PasswordResetTokenRepository;
import com.nhom8.freelance.repositories.RoleRepository;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Transactional
    public JwtAuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng!");
        }

        String roleName = request.getRole();
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        if ("ROLE_ADMIN".equalsIgnoreCase(roleName)) {
            throw new BadRequestException("Không thể tự đăng ký tài khoản Quản trị viên (ADMIN)!");
        }

        if (!"ROLE_STUDENT".equalsIgnoreCase(roleName) && !"ROLE_EMPLOYER".equalsIgnoreCase(roleName)) {
            throw new BadRequestException("Vai trò không hợp lệ: " + request.getRole());
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new BadRequestException("Vai trò không tồn tại trong hệ thống: " + request.getRole()));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(role)
                .university(request.getUniversity())
                .major(request.getMajor())
                .companyName(request.getCompanyName())
                .isActive(true)
                .build();

        userRepository.save(user);

        return login(new LoginRequest() {{
            setEmail(request.getEmail());
            setPassword(request.getPassword());
        }});
    }

    public JwtAuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Người dùng không tồn tại"));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new BadRequestException("Tài khoản của bạn đã bị khóa hoặc vô hiệu hóa. Vui lòng liên hệ Admin!");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return JwtAuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().getName())
                .build();
    }

    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("Người dùng không tồn tại"));
    }

    @Transactional
    public Map<String, Object> createPasswordResetToken(ForgotPasswordRequest request) {
        Map<String, Object> result = new HashMap<>();
        result.put("email", request.getEmail());

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().trim());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Delete old tokens for clean state
            passwordResetTokenRepository.deleteByUserId(user.getId());

            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .user(user)
                    .expiryDate(LocalDateTime.now().plusMinutes(15))
                    .used(false)
                    .build();
            passwordResetTokenRepository.save(resetToken);

            result.put("resetTokenPreview", token);
        } else {
            // Do not reveal email absence for anti-enumeration security
            result.put("resetTokenPreview", null);
        }

        return result;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken().trim())
                .orElseThrow(() -> new BadRequestException("Mã token đặt lại mật khẩu không hợp lệ hoặc không tồn tại"));

        if (Boolean.TRUE.equals(resetToken.getUsed())) {
            throw new BadRequestException("Mã token đặt lại mật khẩu đã được sử dụng trước đó");
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Mã token đặt lại mật khẩu đã hết hạn (chỉ có hiệu lực trong 15 phút)");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
