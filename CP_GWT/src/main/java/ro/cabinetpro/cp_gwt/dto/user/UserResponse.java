package ro.cabinetpro.cp_gwt.dto.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import ro.cabinetpro.cp_gwt.dto.types.AbstractDTO;
import ro.cabinetpro.cp_gwt.dto.types.MicroserviceAware;
import ro.cabinetpro.cp_gwt.dto.types.Role;
import ro.cabinetpro.cp_gwt.ms.Microservice;

@Getter
@Setter
public class UserResponse extends AbstractDTO implements MicroserviceAware {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private Role role;
    private boolean active;
    private boolean enabled;
    private String createdAt;
    private String activationLink;
    private Long cabinetId;

    @Override
    @JsonIgnore
    public Microservice getMicroservice() {
        return Microservice.GWY;
    }

    public String getActivationLink() {
        if (active) {
            return null;
        }
        return activationLink;
    }
}
