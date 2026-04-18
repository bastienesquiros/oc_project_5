package com.openclassrooms.mddapi.repository;

import com.openclassrooms.mddapi.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.topic.id IN (SELECT s.topic.id FROM Subscription s WHERE s.user.id = :userId)")
    Page<Post> findFeedByUserId(Long userId, Pageable pageable);
}
