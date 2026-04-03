package ro.cabinetpro.cp_gwt.dto.user;

import lombok.Getter;
import lombok.Setter;
import ro.cabinetpro.cp_gwt.dto.types.Role;

@Getter
@Setter
public class UserRequest {
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private Role role;
    private Long cabinetId;
}
