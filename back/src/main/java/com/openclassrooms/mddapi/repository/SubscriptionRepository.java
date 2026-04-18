package com.openclassrooms.mddapi.repository;

import com.openclassrooms.mddapi.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserId(Long userId);
    Optional<Subscription> findByUserIdAndTopicId(Long userId, Long topicId);
    boolean existsByUserIdAndTopicId(Long userId, Long topicId);
}
