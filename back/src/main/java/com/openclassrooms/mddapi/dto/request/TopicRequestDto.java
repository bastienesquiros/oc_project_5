package com.openclassrooms.mddapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TopicRequestDto(
        @NotBlank @Size(max = 50) String title,
        @NotBlank String description) {
}
