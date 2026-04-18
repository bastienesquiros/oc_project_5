package com.openclassrooms.mddapi.mapper;

import com.openclassrooms.mddapi.dto.request.TopicRequestDto;
import com.openclassrooms.mddapi.dto.response.TopicResponseDto;
import com.openclassrooms.mddapi.entity.Topic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TopicMapper {

    TopicResponseDto toDto(Topic topic);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "posts", ignore = true)
    @Mapping(target = "subscriptions", ignore = true)
    @Mapping(target = "created", ignore = true)
    @Mapping(target = "lastModified", ignore = true)
    Topic toEntity(TopicRequestDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "posts", ignore = true)
    @Mapping(target = "subscriptions", ignore = true)
    @Mapping(target = "created", ignore = true)
    @Mapping(target = "lastModified", ignore = true)
    void updateEntity(TopicRequestDto dto, @MappingTarget Topic topic);
}
