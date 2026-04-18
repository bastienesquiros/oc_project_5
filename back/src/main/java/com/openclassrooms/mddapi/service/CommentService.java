package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.request.CommentRequestDto;
import com.openclassrooms.mddapi.dto.response.CommentResponseDto;
import com.openclassrooms.mddapi.entity.Comment;
import com.openclassrooms.mddapi.entity.Post;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.exception.ResourceNotFoundException;
import com.openclassrooms.mddapi.mapper.CommentMapper;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    public Page<CommentResponseDto> findByPostId(Long postId, Pageable pageable) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id: " + postId);
        }
        return commentRepository.findByPostId(postId, pageable).map(commentMapper::toDto);
    }

    public CommentResponseDto create(CommentRequestDto dto) {
        Post post = postRepository.findById(dto.postId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + dto.postId()));
        User author = userRepository.findById(dto.authorId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.authorId()));

        log.info("User {} commenting on post {}", dto.authorId(), dto.postId());
        Comment comment = new Comment();
        comment.setContent(dto.content());
        comment.setPost(post);
        comment.setAuthor(author);
        return commentMapper.toDto(commentRepository.save(comment));
    }

    public void delete(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Comment not found with id: " + id);
        }
        log.info("Deleting comment {}", id);
        commentRepository.deleteById(id);
    }
}
