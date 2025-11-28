package ro.cabinetpro.cp_gwt.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.cabinetpro.cp_gwt.dto.types.AbstractDTO;
import ro.cabinetpro.cp_gwt.dto.types.MicroserviceAware;
import ro.cabinetpro.cp_gwt.ms.Microservice;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse extends AbstractDTO implements MicroserviceAware {
    private String accessToken;   // JWT-ul
    private String tokenType;     // de obicei "Bearer"
    private Long expiresIn;       // în secunde
    private String username;      // numele utilizatorului logat
    private String role;          // rolul (ADMIN / USER / THERAPIST)

    @Override
    public Microservice getMicroservice() {
        return Microservice.GWY;
    }
}
