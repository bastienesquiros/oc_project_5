package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.response.PostResponseDto;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.mapper.PostMapper;
import com.openclassrooms.mddapi.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeedService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;

    public Page<PostResponseDto> getFeed(User user, Pageable pageable) {
        return postRepository.findFeedByUserId(user.getId(), pageable).map(postMapper::toDto);
    }
}
