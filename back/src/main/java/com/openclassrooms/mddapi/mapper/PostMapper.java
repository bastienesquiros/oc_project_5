package com.openclassrooms.mddapi.mapper;

import com.openclassrooms.mddapi.dto.response.PostResponseDto;
import com.openclassrooms.mddapi.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(source = "user.id", target = "authorId")
    @Mapping(source = "user.username", target = "authorUsername")
    @Mapping(source = "topic.id", target = "topicId")
    @Mapping(source = "topic.title", target = "topicTitle")
    PostResponseDto toDto(Post post);
}
