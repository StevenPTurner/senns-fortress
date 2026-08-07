package com.andrsteve.sennsfortress.validation;

import lombok.*;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    @Builder.Default
    @EqualsAndHashCode.Exclude
    private ZonedDateTime timestamp = ZonedDateTime.now(ZoneId.of("UTC"));

    private Integer statusCode;

    private String error;

    @Singular("message")
    private List<String> messages;
}
