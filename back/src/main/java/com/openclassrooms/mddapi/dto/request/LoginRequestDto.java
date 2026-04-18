package com.openclassrooms.mddapi.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDto(
        @NotBlank String identifier,
        @NotBlank String password) {
}
