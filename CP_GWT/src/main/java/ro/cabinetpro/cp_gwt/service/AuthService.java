package ro.cabinetpro.cp_gwt.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import ro.cabinetpro.cp_gwt.dto.auth.LoginRequest;
import ro.cabinetpro.cp_gwt.dto.auth.LoginResponse;
import ro.cabinetpro.cp_gwt.dto.auth.RegisterRequest;
import ro.cabinetpro.cp_gwt.dto.auth.RegisterResponse;
import ro.cabinetpro.cp_gwt.dto.cabinet.CabinetResponse;
import ro.cabinetpro.cp_gwt.dto.user.ActivateAccountRequest;
import ro.cabinetpro.cp_gwt.ms.Microservice;

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

        LoginResponse loginResponse = postEntity("auth/login", request, LoginResponse.class);

        if (loginResponse != null) {
            if ("admin".equalsIgnoreCase(loginResponse.getRole())) {
                if (loginResponse.getCabinetId() == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid cabinet");
                }
            }
        }

        return loginResponse;
    }

    public RegisterResponse register(RegisterRequest request) {
        return postEntity("auth/register", request, RegisterResponse.class);
    }

    public void activateAccount(ActivateAccountRequest request) {
        postVoid(Microservice.GWY, "auth/activate", request);
    }
}
