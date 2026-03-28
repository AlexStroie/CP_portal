package ro.cabinetpro.cp_gwt.dto.cabinet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import ro.cabinetpro.cp_gwt.dto.types.AbstractDTO;
import ro.cabinetpro.cp_gwt.dto.types.MicroserviceAware;
import ro.cabinetpro.cp_gwt.ms.Microservice;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class CabinetSettings extends AbstractDTO implements MicroserviceAware {

    private Long cabinetId;

    private LocalTime startHour;

    private LocalTime endHour;

    private Integer slotDurationMin;

    private String workingDays;

    private LocalDateTime updatedAt;

    @Override
    @JsonIgnore
    public Microservice getMicroservice() {
        return Microservice.GWY;
    }
}
