package ro.cabinetpro.cp_gwt.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.cabinetpro.cp_gwt.dto.patient.PatientRequest;
import ro.cabinetpro.cp_gwt.dto.patient.PatientResponse;
import ro.cabinetpro.cp_gwt.service.PatientService;

import java.util.List;

@RestController
@RequestMapping("/web/v1/api/admin/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public List<PatientResponse> getAll() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public PatientResponse getOne(@PathVariable Long id) {
        return patientService.getPatient(id);
    }

    @PostMapping
    public PatientResponse save(@RequestBody PatientRequest req) {
        return patientService.savePatient(req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        patientService.deletePatient(id);
    }

    @GetMapping("/count")
    public Integer countUsers() {
        return patientService.count();
    }
}
