package com.andrsteve.sennsfortress.authentication.providers;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthProviderData {
    String id;
    String email;
    String name;
}