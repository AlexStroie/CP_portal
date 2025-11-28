package ro.cabinetpro.cp_gwt.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.cabinetpro.cp_gwt.dto.user.UserRequest;
import ro.cabinetpro.cp_gwt.dto.user.UserResponse;
import ro.cabinetpro.cp_gwt.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/web/v1/api/super-admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponse> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponse getOne(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @PostMapping
    public UserResponse create(@RequestBody UserRequest req) {
        return userService.createUser(req);
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable Long id, @RequestBody UserRequest req) {
        return userService.updateUser(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
