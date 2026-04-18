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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final TopicRepository topicRepository;
    private final SubscriptionMapper subscriptionMapper;

    public SubscriptionResponseDto subscribe(User user, SubscriptionRequestDto dto) {
        if (subscriptionRepository.existsByUserIdAndTopicId(user.getId(), dto.topicId())) {
            log.warn("User {} already subscribed to topic {}", user.getId(), dto.topicId());
            throw new IllegalStateException("User is already subscribed to this topic");
        }
        Topic topic = topicRepository.findById(dto.topicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.topicId()));
        log.info("User {} subscribing to topic {}", user.getId(), dto.topicId());
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setTopic(topic);
        return subscriptionMapper.toDto(subscriptionRepository.save(subscription));
    }

    public void unsubscribe(User user, Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + subscriptionId));
        if (!subscription.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Cannot delete another user's subscription");
        }
        log.info("User {} unsubscribing from subscription {}", user.getId(), subscriptionId);
        subscriptionRepository.deleteById(subscriptionId);
    }
}
