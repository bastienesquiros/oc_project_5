package com.openclassrooms.mddapi.dto.response;

import java.time.LocalDateTime;

public record PostResponseDto(
        Long id,
        String title,
        String content,
        Long authorId,
        String authorUsername,
        Long topicId,
        String topicTitle,
        LocalDateTime created,
        LocalDateTime lastModified) {
}
