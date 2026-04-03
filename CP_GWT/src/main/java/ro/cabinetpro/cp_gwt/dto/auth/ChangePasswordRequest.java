package ro.cabinetpro.cp_gwt.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {

    private String username;
    private String oldPassword;

    private String newPassword;
    private String confirmPassword;
}
