package com.openclassrooms.mddapi.mapper;

import com.openclassrooms.mddapi.dto.response.SubscriptionResponseDto;
import com.openclassrooms.mddapi.entity.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "topic.id", target = "topicId")
    @Mapping(source = "topic.title", target = "topicTitle")
    SubscriptionResponseDto toDto(Subscription subscription);
}
