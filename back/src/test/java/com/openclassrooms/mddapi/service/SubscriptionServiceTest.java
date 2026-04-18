package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.request.SubscriptionRequestDto;
import com.openclassrooms.mddapi.entity.Subscription;
import com.openclassrooms.mddapi.entity.Topic;
import com.openclassrooms.mddapi.entity.User;
import com.openclassrooms.mddapi.exception.ResourceNotFoundException;
import com.openclassrooms.mddapi.mapper.SubscriptionMapper;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock SubscriptionRepository subscriptionRepository;
    @Mock TopicRepository topicRepository;
    @Mock SubscriptionMapper subscriptionMapper;

    @InjectMocks SubscriptionService subscriptionService;

    private User userWithId(Long id) {
        User u = new User();
        u.setId(id);
        return u;
    }

    @Test
    void subscribe_alreadySubscribed_throws() {
        User user = userWithId(1L);
        when(subscriptionRepository.existsByUserIdAndTopicId(1L, 10L)).thenReturn(true);

        assertThatThrownBy(() -> subscriptionService.subscribe(user, new SubscriptionRequestDto(10L)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already subscribed");
    }

    @Test
    void subscribe_topicNotFound_throws() {
        User user = userWithId(1L);
        when(subscriptionRepository.existsByUserIdAndTopicId(1L, 10L)).thenReturn(false);
        when(topicRepository.findById(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subscriptionService.subscribe(user, new SubscriptionRequestDto(10L)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void subscribe_success_savesAndReturns() {
        User user = userWithId(1L);
        Topic topic = new Topic();
        topic.setId(10L);
        when(subscriptionRepository.existsByUserIdAndTopicId(1L, 10L)).thenReturn(false);
        when(topicRepository.findById(10L)).thenReturn(Optional.of(topic));
        when(subscriptionRepository.save(any())).thenReturn(new Subscription());

        subscriptionService.subscribe(user, new SubscriptionRequestDto(10L));

        verify(subscriptionRepository).save(any(Subscription.class));
    }

    @Test
    void unsubscribe_notFound_throws() {
        User user = userWithId(1L);
        when(subscriptionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subscriptionService.unsubscribe(user, 99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void unsubscribe_notOwner_throws() {
        User owner = userWithId(2L);
        User other = userWithId(1L);
        Subscription sub = new Subscription();
        sub.setUser(owner);
        when(subscriptionRepository.findById(5L)).thenReturn(Optional.of(sub));

        assertThatThrownBy(() -> subscriptionService.unsubscribe(other, 5L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot delete another user");
    }

    @Test
    void unsubscribe_success_deletes() {
        User user = userWithId(1L);
        Subscription sub = new Subscription();
        sub.setUser(user);
        when(subscriptionRepository.findById(5L)).thenReturn(Optional.of(sub));

        subscriptionService.unsubscribe(user, 5L);

        verify(subscriptionRepository).deleteById(5L);
    }
}
