package ro.cabinetpro.cp_gwt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<?> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleBusiness(ResponseStatusException ex) {

        ObjectMapper mapper = new ObjectMapper();

        String responseBodyAsString = ex.getReason();

        JsonNode node = mapper.readTree(responseBodyAsString);
        String message = node.get("message").asString();

        return ResponseEntity
                .status(ex.getStatusCode())
                .body(Map.of(
                        "message", message
                ));

    }
}
