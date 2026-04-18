package com.openclassrooms.mddapi.dto.response;

import java.time.LocalDateTime;

public record UserResponseDto(
        Long id,
        String username,
        String email,
        LocalDateTime created) {
}
