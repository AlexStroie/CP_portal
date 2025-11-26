package ro.cabinetpro.cp_gwt.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.cabinetpro.cp_gwt.dto.auth.LoginRequest;
import ro.cabinetpro.cp_gwt.dto.auth.LoginResponse;
import ro.cabinetpro.cp_gwt.dto.auth.RegisterRequest;
import ro.cabinetpro.cp_gwt.exception.InvalidCredentialsException;
import ro.cabinetpro.cp_gwt.service.AuthService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/web/v1/api/auth/")
public class AuthController {

    private final AuthService authService;

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);
        if (loginResponse == null) {
            throw new InvalidCredentialsException("Invalid credentials");
        }
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
}
