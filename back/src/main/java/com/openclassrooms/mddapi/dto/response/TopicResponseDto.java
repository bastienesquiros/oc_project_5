package com.openclassrooms.mddapi.dto.response;

import java.time.LocalDateTime;

public record TopicResponseDto(
        Long id,
        String title,
        String description,
        LocalDateTime created) {
}
