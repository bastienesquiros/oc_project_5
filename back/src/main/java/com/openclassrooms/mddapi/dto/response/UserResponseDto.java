package com.openclassrooms.mddapi.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record UserResponseDto(
        Long id,
        String displayName,
        String email,
        List<SubscriptionResponseDto> subscriptions,
        LocalDateTime created) {
}
