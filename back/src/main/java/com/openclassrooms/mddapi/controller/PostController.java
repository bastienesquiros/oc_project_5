package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.request.PostRequestDto;
import com.openclassrooms.mddapi.dto.response.CommentResponseDto;
import com.openclassrooms.mddapi.dto.response.PostResponseDto;
import com.openclassrooms.mddapi.service.CommentService;
import com.openclassrooms.mddapi.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<Page<PostResponseDto>> getAll(
            @PageableDefault(size = 20, sort = "created", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(postService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.findById(id));
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<Page<CommentResponseDto>> getComments(
            @PathVariable Long postId,
            @PageableDefault(size = 20, sort = "created", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(commentService.findByPostId(postId, pageable));
    }

    @PostMapping
    public ResponseEntity<PostResponseDto> create(@Valid @RequestBody PostRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDto> update(@PathVariable Long id, @Valid @RequestBody PostRequestDto dto) {
        return ResponseEntity.ok(postService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
