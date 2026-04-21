package ro.cabinetpro.cp_gwt.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class AppException extends RuntimeException {

    private final String code;
    private final HttpStatus status;
    private final Map<String, Object> details;

    public AppException(String code, HttpStatus status) {
        this(code, status, null);
    }

    public AppException(String code, HttpStatus status, Map<String, Object> details) {
        super(code);
        this.code = code;
        this.status = status;
        this.details = details;
    }

    public String getCode() { return code; }
    public HttpStatus getStatus() { return status; }
    public Map<String, Object> getDetails() { return details; }
}