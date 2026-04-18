package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.request.SubscriptionRequestDto;
import com.openclassrooms.mddapi.dto.response.SubscriptionResponseDto;
import com.openclassrooms.mddapi.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SubscriptionResponseDto>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<SubscriptionResponseDto> subscribe(@Valid @RequestBody SubscriptionRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.subscribe(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unsubscribe(@PathVariable Long id) {
        subscriptionService.unsubscribe(id);
        return ResponseEntity.noContent().build();
    }
}
