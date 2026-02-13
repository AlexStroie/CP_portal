package ro.cabinetpro.cp_gwt.dto.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.cabinetpro.cp_gwt.dto.types.Role;

@Getter
@Setter
@NoArgsConstructor
public class SwitchRequest {
    private String username;
    private Long cabinetId;
    private Role role;
}
