package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.request.SubscriptionRequestDto;
import com.openclassrooms.mddapi.dto.response.SubscriptionResponseDto;
import com.openclassrooms.mddapi.entity.Subscription;
import com.openclassrooms.mddapi.entity.Topic;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.exception.ResourceNotFoundException;
import com.openclassrooms.mddapi.mapper.SubscriptionMapper;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final SubscriptionMapper subscriptionMapper;

    public List<SubscriptionResponseDto> findByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return subscriptionRepository.findByUserId(userId).stream()
                .map(subscriptionMapper::toDto)
                .toList();
    }

    public SubscriptionResponseDto subscribe(SubscriptionRequestDto dto) {
        if (subscriptionRepository.existsByUserIdAndTopicId(dto.userId(), dto.topicId())) {
            log.warn("User {} already subscribed to topic {}", dto.userId(), dto.topicId());
            throw new IllegalStateException("User is already subscribed to this topic");
        }
        log.info("User {} subscribing to topic {}", dto.userId(), dto.topicId());
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.userId()));
        Topic topic = topicRepository.findById(dto.topicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.topicId()));

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setTopic(topic);
        return subscriptionMapper.toDto(subscriptionRepository.save(subscription));
    }

    public void unsubscribe(Long id) {
        if (!subscriptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subscription not found with id: " + id);
        }
        log.info("Deleting subscription {}", id);
        subscriptionRepository.deleteById(id);
    }
}
