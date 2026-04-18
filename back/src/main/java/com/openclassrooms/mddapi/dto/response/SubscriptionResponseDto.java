package com.openclassrooms.mddapi.dto.response;

import java.time.LocalDateTime;

public record SubscriptionResponseDto(
        Long id,
        Long userId,
        Long topicId,
        String topicTitle,
        LocalDateTime created) {
}
