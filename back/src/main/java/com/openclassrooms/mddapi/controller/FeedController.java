package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.response.PostResponseDto;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.data.domain.Sort.Direction.DESC;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/feed")
@RequiredArgsConstructor
@Tag(name = "Feed", description = "Authenticated user's post feed from subscribed topics")
public class FeedController {

    private final FeedService feedService;

    @GetMapping
    @Operation(summary = "Get paginated feed sorted by date")
    public ResponseEntity<Page<PostResponseDto>> getFeed(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20, sort = "createdAt", direction = DESC) Pageable pageable) {
        return ResponseEntity.ok(feedService.getFeed(user, pageable));
    }
}
