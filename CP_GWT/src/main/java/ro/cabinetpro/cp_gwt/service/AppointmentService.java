package ro.cabinetpro.cp_gwt.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.cabinetpro.cp_gwt.dto.appointment.AppointmentExtendedResponse;
import ro.cabinetpro.cp_gwt.dto.appointment.AppointmentRequest;
import ro.cabinetpro.cp_gwt.dto.appointment.AppointmentResponse;
import ro.cabinetpro.cp_gwt.ms.Microservice;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService extends AbstractService {

    private final PatientService patientService;
    private final CabinetService cabinetService;
    private final UserService userService;

    public AppointmentService(RestTemplate restTemplate, ServiceRegistry registry,
                              PatientService patientService, CabinetService cabinetService, UserService userService) {
        super(restTemplate, registry);
        this.patientService = patientService;
        this.cabinetService = cabinetService;
        this.userService = userService;
    }

    // ================
    // CRUD standard
    // ================

    public List<AppointmentResponse> getAllAppointments() {
        return getListEntity(AppointmentResponse.class, "admin/appointments");
    }

    public AppointmentResponse getAppointment(Long id) {
        return getObjectEntity(AppointmentResponse.class, "admin/appointments/" + id);
    }

    public AppointmentResponse save(AppointmentRequest request) {
        return postEntity("admin/appointments", request, AppointmentResponse.class);
    }

    public void delete(Long id) {
        deleteEntity(Microservice.GWY, "admin/appointments/" + id);
    }

    // ================
    // Filtrări
    // ================

    public List<AppointmentResponse> getByCabinet(Long cabinetId) {
        return getListEntity(AppointmentResponse.class,
                "admin/appointments/by-cabinet/" + cabinetId);
    }

    public List<AppointmentResponse> getByUser(Long userId) {
        return getListEntity(AppointmentResponse.class,
                "admin/appointments/by-user/" + userId);
    }

    public List<AppointmentResponse> getByPatient(Long patientId) {
        return getListEntity(AppointmentResponse.class,
                "admin/appointments/by-patient/" + patientId);
    }

    public List<AppointmentResponse> getByDate(String date) {
        return getListEntity(AppointmentResponse.class,
                "admin/appointments/date/" + date);
    }

    // ================
    // Extended DTO
    // ================

    public List<AppointmentExtendedResponse> getExtendedForCabinet(Long cabinetId) {
        List<AppointmentResponse> list = getByCabinet(cabinetId);

        return list.stream()
                .map(this::toExtended)
                .collect(Collectors.toList());
    }

    public Integer count() {
        return (Integer) getObjectData(Microservice.GWY, "admin/appointments/count");
    }


    private AppointmentExtendedResponse toExtended(AppointmentResponse dto) {

        AppointmentExtendedResponse ext = new AppointmentExtendedResponse();

        ext.setId(dto.getId());
        ext.setDate(dto.getDate());
        ext.setStartTime(dto.getStartTime());
        ext.setEndTime(dto.getEndTime());
        ext.setStatus(dto.getStatus());
        ext.setNotes(dto.getNotes());

        ext.setPatientId(dto.getPatientId());
        ext.setCabinetId(dto.getCabinetId());
        ext.setUserId(dto.getUserId());

        // 3. Apeluri interne către celelalte microservicii
        var patient = patientService.getPatient(dto.getPatientId());
        ext.setPatientName(patient.getFirstName() + " " + patient.getLastName());

        var cabinet = cabinetService.getCabinet(dto.getCabinetId());
        ext.setCabinetName(cabinet.getName());

        var user = userService.getUser(dto.getUserId());
        ext.setUserFullName(user.getFullName());

        return ext;
    }
}
