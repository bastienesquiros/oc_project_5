package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.request.TopicRequestDto;
import com.openclassrooms.mddapi.dto.response.TopicResponseDto;
import com.openclassrooms.mddapi.entity.Topic;
import com.openclassrooms.mddapi.exception.ResourceNotFoundException;
import com.openclassrooms.mddapi.mapper.TopicMapper;
import com.openclassrooms.mddapi.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicService {

    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;

    public List<TopicResponseDto> findAll() {
        return topicRepository.findAll().stream()
                .map(topicMapper::toDto)
                .toList();
    }

    public TopicResponseDto findById(Long id) {
        return topicRepository.findById(id)
                .map(topicMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + id));
    }

    public TopicResponseDto create(TopicRequestDto dto) {
        log.info("Creating topic '{}'", dto.title());
        Topic topic = topicMapper.toEntity(dto);
        return topicMapper.toDto(topicRepository.save(topic));
    }

    public TopicResponseDto update(Long id, TopicRequestDto dto) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + id));
        topicMapper.updateEntity(dto, topic);
        return topicMapper.toDto(topicRepository.save(topic));
    }

    public void delete(Long id) {
        if (!topicRepository.existsById(id)) {
            throw new ResourceNotFoundException("Topic not found with id: " + id);
        }
        log.info("Deleting topic {}", id);
        topicRepository.deleteById(id);
    }
}
