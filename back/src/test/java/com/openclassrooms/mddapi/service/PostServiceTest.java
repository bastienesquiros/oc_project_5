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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock PostRepository postRepository;
    @Mock TopicRepository topicRepository;
    @Mock PostMapper postMapper;

    @InjectMocks PostService postService;

    @Test
    void findById_notFound_throws() {
        when(postRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void findById_found_returnsDto() {
        Post post = new Post();
        PostResponseDto dto = new PostResponseDto(1L, "Title", "Content", null, null, null, null, null, null);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(postMapper.toDto(post)).thenReturn(dto);

        PostResponseDto result = postService.findById(1L);

        assertThat(result.title()).isEqualTo("Title");
    }

    @Test
    void create_topicNotFound_throws() {
        User author = new User();
        when(topicRepository.findById(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.create(author, new PostRequestDto("T", "C", 5L)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("5");
    }

    @Test
    void create_success_savesPost() {
        User author = new User();
        Topic topic = new Topic();
        Post saved = new Post();
        PostResponseDto dto = new PostResponseDto(1L, "T", "C", null, null, null, null, null, null);
        when(topicRepository.findById(5L)).thenReturn(Optional.of(topic));
        when(postRepository.save(any())).thenReturn(saved);
        when(postMapper.toDto(saved)).thenReturn(dto);

        PostResponseDto result = postService.create(author, new PostRequestDto("T", "C", 5L));

        assertThat(result.title()).isEqualTo("T");
        verify(postRepository).save(any(Post.class));
    }
}
