package ro.cabinetpro.cp_gwt.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import ro.cabinetpro.cp_gwt.dto.auth.LoginRequest;
import ro.cabinetpro.cp_gwt.dto.auth.LoginResponse;
import ro.cabinetpro.cp_gwt.dto.auth.RegisterRequest;
import ro.cabinetpro.cp_gwt.dto.auth.RegisterResponse;

@Service
public class AuthService extends AbstractService {

    public AuthService(RestTemplate restTemplate, ServiceRegistry registry) {
        super(restTemplate, registry);
    }

    public LoginResponse login(LoginRequest request) {
        if (request == null ||
                request.getUsername() == null ||
                request.getPassword() == null ||
                request.getUsername().isBlank() ||
                request.getPassword().isBlank()) {

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid credentials");
        }

        // LoginResponse implementează MicroserviceAware -> USR
        return postEntity("auth/login", request, LoginResponse.class);
    }

    public RegisterResponse register(RegisterRequest request) {
        return postEntity("auth/register", request, RegisterResponse.class);
    }


}
