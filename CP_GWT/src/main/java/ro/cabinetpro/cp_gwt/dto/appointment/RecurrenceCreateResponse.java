package ro.cabinetpro.cp_gwt.dto.appointment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurrenceCreateResponse {
    private List<LocalDate> successfulDates;
    private List<LocalDate> failedDates;

}