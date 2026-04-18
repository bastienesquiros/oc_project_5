package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.request.LoginRequestDto;
import com.openclassrooms.mddapi.dto.request.RegisterRequestDto;
import com.openclassrooms.mddapi.dto.response.AuthResponseDto;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDto login(LoginRequestDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.identifier(), dto.password()));
        log.info("User {} logged in", dto.identifier());
        String email = userRepository.findByEmail(dto.identifier())
                .or(() -> userRepository.findByDisplayName(dto.identifier()))
                .orElseThrow()
                .getEmail();
        return new AuthResponseDto(jwtService.generateToken(email));
    }

    public AuthResponseDto register(RegisterRequestDto dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalStateException("Email already in use");
        }
        if (userRepository.existsByDisplayName(dto.username())) {
            throw new IllegalStateException("Username already taken");
        }
        User user = new User();
        user.setDisplayName(dto.username());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        userRepository.save(user);
        log.info("New user registered: {}", dto.email());
        return new AuthResponseDto(jwtService.generateToken(dto.email()));
    }
}
