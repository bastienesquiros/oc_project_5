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
import com.openclassrooms.mddapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final PostMapper postMapper;

    public Page<PostResponseDto> findAll(Pageable pageable) {
        return postRepository.findAll(pageable).map(postMapper::toDto);
    }

    public PostResponseDto findById(Long id) {
        return postRepository.findById(id)
                .map(postMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    public PostResponseDto create(PostRequestDto dto) {
        User user = userRepository.findById(dto.authorId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getAuthorId()));
        Topic topic = topicRepository.findById(dto.topicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));

        log.info("Creating post '{}' by user {} on topic {}", dto.title(), dto.authorId(), dto.topicId());
        Post post = new Post();
        post.setTitle(dto.title());
        post.setContent(dto.content());
        post.setUser(user);
        post.setTopic(topic);
        return postMapper.toDto(postRepository.save(post));
    }

    public PostResponseDto update(Long id, PostRequestDto dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        return postMapper.toDto(postRepository.save(post));
    }

    public void delete(Long id) {
        if (!postRepository.existsById(id)) {
            throw new ResourceNotFoundException("Post not found with id: " + id);
        }
        log.info("Deleting post {}", id);
        postRepository.deleteById(id);
    }
}
