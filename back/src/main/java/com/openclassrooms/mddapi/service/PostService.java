package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.request.PostRequestDto;
import com.openclassrooms.mddapi.dto.response.PostResponseDto;
import com.openclassrooms.mddapi.entity.Post;
import com.openclassrooms.mddapi.entity.Topic;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.exception.ResourceNotFoundException;
import com.openclassrooms.mddapi.mapper.PostMapper;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final TopicRepository topicRepository;
    private final PostMapper postMapper;

    public PostResponseDto findById(Long id) {
        return postRepository.findById(id)
                .map(postMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    @Transactional
    public PostResponseDto create(User author, PostRequestDto dto) {
        Topic topic = topicRepository.findById(dto.topicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.topicId()));
        log.info("Creating post '{}' by user {} on topic {}", dto.title(), author.getId(), dto.topicId());
        Post post = new Post();
        post.setTitle(dto.title());
        post.setContent(dto.content());
        post.setUser(author);
        post.setTopic(topic);
        return postMapper.toDto(postRepository.save(post));
    }
}
