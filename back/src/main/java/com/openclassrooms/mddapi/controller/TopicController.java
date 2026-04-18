package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.request.TopicRequestDto;
import com.openclassrooms.mddapi.dto.response.TopicResponseDto;
import com.openclassrooms.mddapi.service.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<List<TopicResponseDto>> getAll() {
        return ResponseEntity.ok(topicService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TopicResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(topicService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TopicResponseDto> create(@Valid @RequestBody TopicRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(topicService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TopicResponseDto> update(@PathVariable Long id, @Valid @RequestBody TopicRequestDto dto) {
        return ResponseEntity.ok(topicService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        topicService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
