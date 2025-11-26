package ro.cabinetpro.cp_gwt.dto.auth;

import lombok.Getter;
import lombok.Setter;
import ro.cabinetpro.cp_gwt.dto.AbstractTypeDTO;

@Getter
@Setter
public class RegisterResponse extends AbstractTypeDTO {

    private boolean success;
    private String message;
}
