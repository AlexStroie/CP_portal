package ro.cabinetpro.cp_gwt.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.cabinetpro.cp_gwt.dto.AbstractTypeDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse extends AbstractTypeDTO {
    private String accessToken;   // JWT-ul
    private String tokenType;     // de obicei "Bearer"
    private Long expiresIn;       // în secunde
    private String username;      // numele utilizatorului logat
    private String role;          // rolul (ADMIN / USER / THERAPIST)
}
