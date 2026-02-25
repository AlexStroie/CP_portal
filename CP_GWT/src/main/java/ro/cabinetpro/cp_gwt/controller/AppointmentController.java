package ro.cabinetpro.cp_gwt.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.cabinetpro.cp_gwt.dto.appointment.AppointmentExtendedResponse;
import ro.cabinetpro.cp_gwt.dto.appointment.AppointmentRequest;
import ro.cabinetpro.cp_gwt.dto.appointment.AppointmentResponse;
import ro.cabinetpro.cp_gwt.service.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/web/v1/api/admin/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public AppointmentResponse save(@RequestBody AppointmentRequest req) {
        return appointmentService.save(req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        appointmentService.cancel(id);
    }

    @GetMapping("/by-cabinet/{cabinetId}")
    public List<AppointmentResponse> byCabinet(@PathVariable Long cabinetId) {
        return appointmentService.getByCabinet(cabinetId);
    }

    @GetMapping("/by-user/{userId}")
    public List<AppointmentResponse> byUser(@PathVariable Long userId) {
        return appointmentService.getByUser(userId);
    }

    @GetMapping("/by-patient/{patientId}")
    public List<AppointmentResponse> byPatient(@PathVariable Long patientId) {
        return appointmentService.getByPatient(patientId);
    }

    @GetMapping("/date/{date}")
    public List<AppointmentResponse> byDate(@PathVariable String date) {
        return appointmentService.getByDate(date);
    }

    @GetMapping("/extended/cabinet/{cabinetId}")
    public List<AppointmentExtendedResponse> extendedForCabinet(
            @PathVariable Long cabinetId) {
        return appointmentService.getExtendedForCabinet(cabinetId);
    }

    @GetMapping("/extended/today/cabinet/{cabinetId}")
    public List<AppointmentExtendedResponse> todayExtendedForCabinet(
            @PathVariable Long cabinetId) {
        return appointmentService.getTodayExtendedForCabinet(cabinetId);
    }

    @GetMapping("/count")
    public Integer count() {
        return appointmentService.count();
    }
}
