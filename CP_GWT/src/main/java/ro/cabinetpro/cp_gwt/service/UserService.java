package ro.cabinetpro.cp_gwt.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.cabinetpro.cp_gwt.dto.user.UserRequest;
import ro.cabinetpro.cp_gwt.dto.user.UserResponse;
import ro.cabinetpro.cp_gwt.ms.Microservice;

import java.util.List;

@Service
public class UserService extends AbstractService {

    public UserService(RestTemplate restTemplate, ServiceRegistry registry) {
        super(restTemplate, registry);
    }

    public List<UserResponse> getAllUsers() {
        return getListEntity(UserResponse.class, "admin/users");
    }

    public UserResponse getUser(Long id) {
        return getObjectEntity(UserResponse.class, "admin/users/" + id);
    }

    public UserResponse createUser(UserRequest request) {
        return postEntity("admin/users", request, UserResponse.class);
    }

    public UserResponse updateUser(Long id, UserRequest request) {
        return putEntity("admin/users/" + id, request, UserResponse.class);
    }

    public void deleteUser(Long id) {
        deleteEntity(Microservice.GWY, "admin/users/" + id);
    }

    public Integer count() {
        return (Integer) getObjectData(Microservice.GWY, "admin/users/count");
    }
}
