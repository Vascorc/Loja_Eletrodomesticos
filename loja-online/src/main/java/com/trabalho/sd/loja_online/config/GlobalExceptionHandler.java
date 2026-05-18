package com.trabalho.sd.loja_online.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        String msg = ex.getMessage() != null ? ex.getMessage() : "Erro inesperado";
        HttpStatus status = resolveStatus(msg);
        return ResponseEntity.status(status).body(errorBody(msg, status));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        String msg = ex.getMessage() != null ? ex.getMessage() : "Argumento inválido";
        return ResponseEntity.badRequest().body(errorBody(msg, HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorBody("Erro interno do servidor", HttpStatus.INTERNAL_SERVER_ERROR));
    }

    private HttpStatus resolveStatus(String msg) {
        String lower = msg.toLowerCase();
        if (lower.contains("não encontrad")) return HttpStatus.NOT_FOUND;
        if (lower.contains("já existe") || lower.contains("insuficiente") || lower.contains("inválid"))
            return HttpStatus.BAD_REQUEST;
        return HttpStatus.BAD_REQUEST;
    }

    private Map<String, Object> errorBody(String message, HttpStatus status) {
        return Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", status.value(),
                "erro", message
        );
    }
}
