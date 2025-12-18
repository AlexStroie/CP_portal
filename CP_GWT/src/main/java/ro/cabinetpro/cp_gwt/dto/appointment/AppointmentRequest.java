package ro.cabinetpro.cp_gwt.dto.appointment;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRequest {
    private Long appointmentId;
    private Long patientId;
    private Long cabinetId;
    private Long userId;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private String notes;
}
