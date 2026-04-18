package com.openclassrooms.mddapi.integration;

import com.openclassrooms.mddapi.dto.request.LoginRequestDto;
import com.openclassrooms.mddapi.dto.request.RegisterRequestDto;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class FeedControllerIntegrationTest extends AbstractIntegrationTest {


    private String registerAndGetToken(String username, String email) throws Exception {
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new RegisterRequestDto(username, email, "Password1!"))));

        String response = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new LoginRequestDto(email, "Password1!"))))
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readTree(response).get("token").asText();
    }

    @Test
    void getFeed_authenticated_returnsEmptyPage() throws Exception {
        String token = registerAndGetToken("feeduser", "feeduser@test.com");

        mockMvc.perform(get("/feed")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    void getFeed_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/feed"))
                .andExpect(status().isUnauthorized());
    }
}
