package com.openclassrooms.mddapi.dto.request;

import jakarta.validation.constraints.NotNull;

public record SubscriptionRequestDto(
        @NotNull Long topicId) {
}
