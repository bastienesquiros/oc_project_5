package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.response.TopicResponseDto;
import com.openclassrooms.mddapi.mapper.TopicMapper;
import com.openclassrooms.mddapi.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TopicService {

    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;

    public List<TopicResponseDto> findAll() {
        return topicRepository.findAll().stream()
                .map(topicMapper::toDto)
                .toList();
    }
}
