package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.request.UserRequestDto;
import com.openclassrooms.mddapi.dto.response.UserResponseDto;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.mapper.UserMapper;
import com.openclassrooms.mddapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponseDto getMe(User user) {
        return userMapper.toDto(userRepository.findById(user.getId()).orElseThrow());
    }

    @Transactional
    public UserResponseDto updateMe(User user, UserRequestDto dto) {
        log.info("Updating user {}", user.getId());
        userMapper.updateEntity(dto, user);
        if (dto.password() != null && !dto.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.password()));
        }
        return userMapper.toDto(userRepository.save(user));
    }
}

