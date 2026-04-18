package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.request.PostRequestDto;
import com.openclassrooms.mddapi.dto.response.CommentResponseDto;
import com.openclassrooms.mddapi.dto.response.PostResponseDto;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.service.CommentService;
import com.openclassrooms.mddapi.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Tag(name = "Posts", description = "Create and read posts")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PostResponseDto> create(@AuthenticationPrincipal User user,
                                                  @Valid @RequestBody PostRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.create(user, dto));
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<Page<CommentResponseDto>> getComments(
            @PathVariable Long postId,
            @PageableDefault(size = 20, sort = "created") Pageable pageable) {
        return ResponseEntity.ok(commentService.findByPostId(postId, pageable));
    }
}
