package com.openclassrooms.mddapi.mapper;

import com.openclassrooms.mddapi.dto.request.UserRequestDto;
import com.openclassrooms.mddapi.dto.response.UserResponseDto;
import com.openclassrooms.mddapi.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponseDto toDto(User user);

    void updateEntity(UserRequestDto dto, @MappingTarget User user);
}
