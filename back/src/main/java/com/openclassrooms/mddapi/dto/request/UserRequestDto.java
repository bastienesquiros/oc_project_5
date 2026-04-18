package com.openclassrooms.mddapi.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequestDto(
        @NotBlank @Size(max = 25) String username,
        @NotBlank @Email String email,
        @Size(min = 8) String password) {
}
