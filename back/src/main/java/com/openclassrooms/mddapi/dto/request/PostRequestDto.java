package com.openclassrooms.mddapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PostRequestDto(
        @NotBlank @Size(max = 50) String title,
        @NotBlank String content,
        @NotNull Long topicId) {
}
