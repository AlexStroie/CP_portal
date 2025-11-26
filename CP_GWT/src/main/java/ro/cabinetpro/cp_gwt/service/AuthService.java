package ro.cabinetpro.cp_gwt.service;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import ro.cabinetpro.cp_gwt.dto.auth.LoginRequest;
import ro.cabinetpro.cp_gwt.dto.auth.LoginResponse;
import ro.cabinetpro.cp_gwt.dto.auth.RegisterRequest;
import ro.cabinetpro.cp_gwt.dto.auth.RegisterResponse;
import ro.cabinetpro.cp_gwt.exception.InvalidCredentialsException;

@Service
public class AuthService extends AbstractService {

    public @Nullable LoginResponse login(LoginRequest request) {
        if (request == null ||
                request.getUsername() == null ||
                request.getPassword() == null ||
                request.getUsername().isBlank() ||
                request.getPassword().isBlank()) {

            throw new InvalidCredentialsException("Invalid credentials");
        }
        LoginResponse response = postGatewayService("auth/login", request, LoginResponse.class);

        if (response == null || response.getAccessToken() == null) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        return response;
    }

    public @Nullable RegisterResponse register(RegisterRequest request) {

        RegisterResponse response = postGatewayService("auth/register", request, RegisterResponse.class);

        return response;
    }


}
