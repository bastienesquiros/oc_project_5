package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.request.SubscriptionRequestDto;
import com.openclassrooms.mddapi.dto.response.SubscriptionResponseDto;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscriptions", description = "Subscribe and unsubscribe from topics")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<SubscriptionResponseDto> subscribe(@AuthenticationPrincipal User user,
                                                             @Valid @RequestBody SubscriptionRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.subscribe(user, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unsubscribe(@AuthenticationPrincipal User user,
                                             @PathVariable Long id) {
        subscriptionService.unsubscribe(user, id);
        return ResponseEntity.noContent().build();
    }
}
