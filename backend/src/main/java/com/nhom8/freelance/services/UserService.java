package com.nhom8.freelance.services;

import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));
    }

    @Transactional
    public User updateProfile(Long userId, Map<String, String> payload) {
        User user = getUserById(userId);

        if (payload.containsKey("fullName") && payload.get("fullName") != null) {
            user.setFullName(payload.get("fullName"));
        }
        if (payload.containsKey("phone")) {
            user.setPhone(payload.get("phone"));
        }
        if (payload.containsKey("bio")) {
            user.setBio(payload.get("bio"));
        }
        if (payload.containsKey("skills")) {
            user.setSkills(payload.get("skills"));
        }
        if (payload.containsKey("university")) {
            user.setUniversity(payload.get("university"));
        }
        if (payload.containsKey("major")) {
            user.setMajor(payload.get("major"));
        }
        if (payload.containsKey("companyName")) {
            user.setCompanyName(payload.get("companyName"));
        }
        if (payload.containsKey("companyAddress")) {
            user.setCompanyAddress(payload.get("companyAddress"));
        }
        if (payload.containsKey("avatarUrl")) {
            user.setAvatarUrl(payload.get("avatarUrl"));
        }

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User toggleUserActive(Long userId) {
        User user = getUserById(userId);
        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        return userRepository.save(user);
    }
}
