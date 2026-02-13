package ro.cabinetpro.cp_gwt.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.cabinetpro.cp_gwt.dto.auth.LoginRequest;
import ro.cabinetpro.cp_gwt.dto.auth.LoginResponse;
import ro.cabinetpro.cp_gwt.dto.auth.RegisterRequest;
import ro.cabinetpro.cp_gwt.dto.auth.SwitchRequest;
import ro.cabinetpro.cp_gwt.dto.types.Role;
import ro.cabinetpro.cp_gwt.dto.user.ActivateAccountRequest;
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

    @PostMapping("/activate")
    public ResponseEntity<?> activateAccount(@RequestBody ActivateAccountRequest request) {
        authService.activateAccount(request);
        return ResponseEntity.ok("Account activated successfully");
    }

    @PostMapping("/switchContext")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<LoginResponse> switchCabinet(
            @RequestBody SwitchRequest request) {

        if (StringUtils.isBlank(request.getUsername()) || request.getCabinetId() == null || request.getRole() == null) {
            throw new IllegalArgumentException("Invalid switch request");
        }

        if (request.getRole() == Role.SUPER_ADMIN) {
            throw new IllegalArgumentException("Cannot switch to SUPER_ADMIN");
        }

        LoginResponse loginResponse = authService.switchContext(request);

        return ResponseEntity.ok(loginResponse);
    }


    @PostMapping("/exitDelegation")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<LoginResponse> exitDelegation(HttpServletRequest request) {
        LoginResponse loginResponse = authService.exitDelegation(request);
        return ResponseEntity.ok(loginResponse);
    }
}
