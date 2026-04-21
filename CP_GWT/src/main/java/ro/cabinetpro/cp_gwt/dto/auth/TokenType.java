package ro.cabinetpro.cp_gwt.dto.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.cabinetpro.cp_gwt.dto.types.AbstractDTO;
import ro.cabinetpro.cp_gwt.dto.types.MicroserviceAware;
import ro.cabinetpro.cp_gwt.ms.Microservice;

@Getter
@Setter
@NoArgsConstructor
public class TokenType extends AbstractDTO implements MicroserviceAware {

    private String tokenType;

    @Override
    public Microservice getMicroservice() {
        return Microservice.GWY;
    }
}
