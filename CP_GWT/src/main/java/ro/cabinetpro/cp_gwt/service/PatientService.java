package ro.cabinetpro.cp_gwt.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.cabinetpro.cp_gwt.dto.patient.PatientRequest;
import ro.cabinetpro.cp_gwt.dto.patient.PatientResponse;
import ro.cabinetpro.cp_gwt.ms.Microservice;

import java.util.ArrayList;
import java.util.List;

@Service
public class PatientService extends AbstractService {

    public PatientService(RestTemplate restTemplate, ServiceRegistry registry) {
        super(restTemplate, registry);
    }

    public List<PatientResponse> getAllPatients() {
        return getListEntity(PatientResponse.class, "admin/patients");
    }

    public List<PatientResponse> getAllPatientsByCabinet(Long id) {
        if (id == null) {
            return new ArrayList<>();
        }
        return getListEntity(PatientResponse.class, "admin/patients/cabinet/" + id);
    }

    public PatientResponse getPatient(Long id) {
        return getObjectEntity(PatientResponse.class, "admin/patients/" + id);
    }

    public PatientResponse savePatient(PatientRequest request) {
        return postEntity("admin/patients", request, PatientResponse.class);
    }

    public void deletePatient(Long id) {
        deleteEntity(Microservice.GWY, "admin/patients/" + id);
    }

    public Integer count() {
        return (Integer) getObjectData(Microservice.GWY, "admin/patients/count");
    }
}
