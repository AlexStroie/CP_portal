package ro.cabinetpro.cp_gwt.dto.appointment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import ro.cabinetpro.cp_gwt.dto.types.AbstractDTO;
import ro.cabinetpro.cp_gwt.dto.types.MicroserviceAware;
import ro.cabinetpro.cp_gwt.ms.Microservice;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentResponse extends AbstractDTO implements MicroserviceAware {
    private Long id;

    private Long patientId;
    private Long cabinetId;
    private Long userId;

    private String patientName;
    private String cabinetName;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private String status;
    private String notes;

    @Override
    @JsonIgnore
    public Microservice getMicroservice() {
        return Microservice.GWY;
    }
}