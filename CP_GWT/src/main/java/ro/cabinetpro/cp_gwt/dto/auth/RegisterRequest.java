package ro.cabinetpro.cp_gwt.dto.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.cabinetpro.cp_gwt.dto.types.AbstractDTO;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest extends AbstractDTO {

    private String username;

    private String password;

}