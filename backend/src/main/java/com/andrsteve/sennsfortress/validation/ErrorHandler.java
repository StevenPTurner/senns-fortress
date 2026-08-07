package com.andrsteve.sennsfortress.validation;

import com.andrsteve.sennsfortress.validation.exceptions.*;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@SuppressWarnings("unused")
@RestControllerAdvice
public class ErrorHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    public ErrorResponse handleConstraintViolationException(ConstraintViolationException exception) {
        List<String> errorMessages = exception.getConstraintViolations()
                .stream()
                .map(ConstraintViolation::getMessage)
                .toList();

        return ErrorResponse.builder()
                .error(BAD_REQUEST.getReasonPhrase())
                .statusCode(BAD_REQUEST.value())
                .messages(errorMessages)
                .build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    public ErrorResponse handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        List<String> errorMessages = exception.getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .toList();

        return ErrorResponse.builder()
                .error(BAD_REQUEST.getReasonPhrase())
                .statusCode(BAD_REQUEST.value())
                .messages(errorMessages)
                .build();
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    public ErrorResponse handleMissingRequestParameterException(MissingServletRequestParameterException exception) {
        String message = "%s: parameter is required as a %s".formatted(exception.getParameterName(), exception.getParameterType());

        return ErrorResponse.builder()
                .error(BAD_REQUEST.getReasonPhrase())
                .statusCode(BAD_REQUEST.value())
                .message(message)
                .build();
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(NOT_FOUND)
    @ResponseBody
    public ErrorResponse handleNotFoundException(NotFoundException exception) {
        return ErrorResponse.builder()
                .error(NOT_FOUND.getReasonPhrase())
                .statusCode(NOT_FOUND.value())
                .message(exception.getReason())
                .build();
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    public ErrorResponse handleHttpMessageNotReadable(HttpMessageNotReadableException exception) {
        String message = "Invalid JSON in request body";
        if (messageContains(exception, "Required request body is missing")) {
            message = "Request body is missing";
        }
        return ErrorResponse.builder()
                .error(BAD_REQUEST.getReasonPhrase())
                .statusCode(BAD_REQUEST.value())
                .message(message)
                .build();
    }

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    public ErrorResponse handleBadRequestException(BadRequestException exception) {
        return ErrorResponse.builder()
                .error(BAD_REQUEST.getReasonPhrase())
                .statusCode(BAD_REQUEST.value())
                .message(exception.getReason())
                .build();
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(UNAUTHORIZED)
    @ResponseBody
    public ErrorResponse handleUnauthorizedRequestException(UnauthorizedException exception) {
        return ErrorResponse.builder()
                .error(UNAUTHORIZED.getReasonPhrase())
                .statusCode(UNAUTHORIZED.value())
                .message(exception.getReason())
                .build();
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(FORBIDDEN)
    @ResponseBody
    public ErrorResponse handleForbiddenRequestException(ForbiddenException exception) {
        return ErrorResponse.builder()
                .error(FORBIDDEN.getReasonPhrase())
                .statusCode(FORBIDDEN.value())
                .message(exception.getReason())
                .build();
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    public ErrorResponse handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException exception) {
        String message = "Invalid type for url parameter";
        if ("id".equals(exception.getName()) && messageContains(exception, "to required type 'java.lang.Integer'")) {
            message = "The url parameter 'id' must be an integer";
        }
        return ErrorResponse.builder()
                .error(BAD_REQUEST.getReasonPhrase())
                .statusCode(BAD_REQUEST.value())
                .message(message)
                .build();
    }

    @ExceptionHandler(InternalServerErrorException.class)
    @ResponseStatus(INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorResponse handlerInternalServerException(InternalServerErrorException exception) {
        return ErrorResponse.builder()
                .error(INTERNAL_SERVER_ERROR.getReasonPhrase())
                .statusCode(INTERNAL_SERVER_ERROR.value())
                .message(exception.getMessage())
                .build();
    }

    private boolean messageContains(Exception exception, String expected) {
        return exception.getMessage() != null && exception.getMessage().contains(expected);
    }
}
