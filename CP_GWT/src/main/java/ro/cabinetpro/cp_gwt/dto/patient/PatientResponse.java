package ro.cabinetpro.cp_gwt.dto.patient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.cabinetpro.cp_gwt.dto.types.AbstractDTO;
import ro.cabinetpro.cp_gwt.dto.types.MicroserviceAware;
import ro.cabinetpro.cp_gwt.ms.Microservice;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientResponse extends AbstractDTO implements MicroserviceAware {
    private Long id;
    private Long cabinetId;
    private String firstName;
    private String lastName;
    private String cnp;
    private String phone;
    private String email;
    private String notes;
    private String createdAt;
    private String updatedAt;

    @Override
    @JsonIgnore
    public Microservice getMicroservice() {
        return Microservice.GWY;
    }
}
