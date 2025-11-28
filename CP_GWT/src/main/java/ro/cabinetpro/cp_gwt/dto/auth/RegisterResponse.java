package ro.cabinetpro.cp_gwt.dto.auth;

import lombok.Getter;
import lombok.Setter;
import ro.cabinetpro.cp_gwt.dto.types.AbstractDTO;
import ro.cabinetpro.cp_gwt.dto.types.MicroserviceAware;
import ro.cabinetpro.cp_gwt.ms.Microservice;

@Getter
@Setter
public class RegisterResponse extends AbstractDTO implements MicroserviceAware {

    private boolean success;
    private String message;

    @Override
    public Microservice getMicroservice() {
        return Microservice.GWY;
    }
}
