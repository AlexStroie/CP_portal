package ro.cabinetpro.cp_gwt.dto.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.cabinetpro.cp_gwt.dto.AbstractTypeDTO;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest extends AbstractTypeDTO {

    private String username;

    private String password;

}