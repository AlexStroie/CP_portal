package ro.cabinetpro.cp_gwt.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.cabinetpro.cp_gwt.dto.appointment.AppointmentExtendedResponse;
import ro.cabinetpro.cp_gwt.dto.appointment.AppointmentRequest;
import ro.cabinetpro.cp_gwt.dto.appointment.AppointmentResponse;
import ro.cabinetpro.cp_gwt.ms.Microservice;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService extends AbstractService {


    public AppointmentService(RestTemplate restTemplate, ServiceRegistry registry) {
        super(restTemplate, registry);
    }

    public AppointmentResponse save(AppointmentRequest request) {
        return postEntity("admin/appointments", request, AppointmentResponse.class);
    }

    public void cancel(Long id) {
        deleteEntity(Microservice.GWY, "admin/appointments/" + id);
    }


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

    public List<AppointmentExtendedResponse> getExtendedForCabinet(Long cabinetId) {
        List<AppointmentResponse> list = getByCabinet(cabinetId);

        return list.stream()
                .map(this::toExtended)
                .collect(Collectors.toList());
    }

    public List<AppointmentExtendedResponse> getTodayExtendedForCabinet(Long cabinetId) {
        List<AppointmentResponse> list = getByCabinet(cabinetId);

        LocalDate today = LocalDate.now(ZoneId.of("Europe/Bucharest"));

        return list.stream()
                .filter(a -> today.equals(a.getDate()))
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

        ext.setCabinetName(dto.getCabinetName());
        ext.setPatientName(dto.getPatientName());

        ext.setPhone(dto.getPhone());

        return ext;
    }
}
