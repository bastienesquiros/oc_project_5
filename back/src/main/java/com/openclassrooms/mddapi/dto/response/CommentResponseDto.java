package com.openclassrooms.mddapi.dto.response;

import java.time.LocalDateTime;

public record CommentResponseDto(
        Long id,
        String content,
        Long authorId,
        String authorUsername,
        Long postId,
        LocalDateTime created) {
}
