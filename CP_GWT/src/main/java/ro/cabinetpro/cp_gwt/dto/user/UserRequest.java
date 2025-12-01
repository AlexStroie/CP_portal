package ro.cabinetpro.cp_gwt.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
    private String fullName;
    private String username;
    private String email;
    private String role;
    private Long cabinetId;
}
