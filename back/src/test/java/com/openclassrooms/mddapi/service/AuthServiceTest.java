package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.request.LoginRequestDto;
import com.openclassrooms.mddapi.dto.request.RegisterRequestDto;
import com.openclassrooms.mddapi.dto.response.AuthResponseDto;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock AuthenticationManager authenticationManager;

    @InjectMocks AuthService authService;

    @Test
    void login_withEmail_returnsToken() {
        User user = new User();
        user.setId(1L);
        user.setEmail("alice@test.com");
        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(Long.class))).thenReturn("jwt-token");

        AuthResponseDto result = authService.login(new LoginRequestDto("alice@test.com", "pass"));

        assertThat(result.token()).isEqualTo("jwt-token");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_withDisplayName_returnsToken() {
        User user = new User();
        user.setId(1L);
        user.setEmail("alice@test.com");
        when(userRepository.findByEmail("alice")).thenReturn(Optional.empty());
        when(userRepository.findByDisplayName("alice")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(Long.class))).thenReturn("jwt-token");

        AuthResponseDto result = authService.login(new LoginRequestDto("alice", "pass"));

        assertThat(result.token()).isEqualTo("jwt-token");
    }

    @Test
    void login_badCredentials_throws() {
        doThrow(new BadCredentialsException("bad"))
                .when(authenticationManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(new LoginRequestDto("alice@test.com", "wrong")))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void register_success_returnsToken() {
        when(userRepository.existsByEmail("alice@test.com")).thenReturn(false);
        when(userRepository.existsByDisplayName("alice")).thenReturn(false);
        when(passwordEncoder.encode("Password1!")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> { User u = inv.getArgument(0); u.setId(1L); return u; });
        when(jwtService.generateToken(any(Long.class))).thenReturn("jwt-token");

        AuthResponseDto result = authService.register(
                new RegisterRequestDto("alice", "alice@test.com", "Password1!"));

        assertThat(result.token()).isEqualTo("jwt-token");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_duplicateEmail_throws() {
        when(userRepository.existsByEmail("alice@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(
                new RegisterRequestDto("alice", "alice@test.com", "Password1!")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Email already in use");
    }

    @Test
    void register_duplicateUsername_throws() {
        when(userRepository.existsByEmail("alice@test.com")).thenReturn(false);
        when(userRepository.existsByDisplayName("alice")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(
                new RegisterRequestDto("alice", "alice@test.com", "Password1!")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Username already taken");
    }
}
