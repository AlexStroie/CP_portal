package ro.cabinetpro.cp_gwt.dto.cabinet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import ro.cabinetpro.cp_gwt.dto.types.AbstractDTO;
import ro.cabinetpro.cp_gwt.dto.types.MicroserviceAware;
import ro.cabinetpro.cp_gwt.ms.Microservice;

@Data
public class CabinetResponse extends AbstractDTO implements MicroserviceAware {
    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private boolean active;
    private String createdAt;

    @Override
    @JsonIgnore
    public Microservice getMicroservice() {
        return Microservice.GWY;
    }
}
