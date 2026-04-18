package com.openclassrooms.mddapi.mapper;

import com.openclassrooms.mddapi.dto.request.UserRequestDto;
import com.openclassrooms.mddapi.dto.response.UserResponseDto;
import com.openclassrooms.mddapi.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = SubscriptionMapper.class, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    UserResponseDto toDto(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(source = "username", target = "displayName")
    void updateEntity(UserRequestDto dto, @MappingTarget User user);
}
