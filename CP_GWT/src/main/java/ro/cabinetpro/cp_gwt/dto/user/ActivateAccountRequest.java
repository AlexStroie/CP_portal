package ro.cabinetpro.cp_gwt.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActivateAccountRequest {
    private String token;
    private String newPassword;
}
