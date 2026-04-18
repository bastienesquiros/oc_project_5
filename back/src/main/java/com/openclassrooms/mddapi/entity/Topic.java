package com.openclassrooms.mddapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;
    @Column(nullable = false, length = 50, unique = true)
    private String title;
    @Column(nullable = false)
    private String description;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "topic")
    private List<Post> posts = new ArrayList<>();
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "topic")
    private Set<Subscription> subscriptions = new HashSet<>();
    @CreatedDate
    private LocalDateTime created;
    @LastModifiedDate
    private LocalDateTime lastModified;
}
