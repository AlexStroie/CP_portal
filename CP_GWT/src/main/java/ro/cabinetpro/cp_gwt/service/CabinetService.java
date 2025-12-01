package ro.cabinetpro.cp_gwt.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.cabinetpro.cp_gwt.dto.cabinet.CabinetRequest;
import ro.cabinetpro.cp_gwt.dto.cabinet.CabinetResponse;
import ro.cabinetpro.cp_gwt.ms.Microservice;

import java.util.List;

@Service
public class CabinetService extends AbstractService {

    public CabinetService(RestTemplate restTemplate, ServiceRegistry registry) {
        super(restTemplate, registry);
    }

    public List<CabinetResponse> getAllCabinets() {
        return getListEntity(CabinetResponse.class, "admin/cabinets");
    }

    public CabinetResponse getCabinet(Long id) {
        return getObjectEntity(CabinetResponse.class, "admin/cabinets/" + id);
    }

    public CabinetResponse createCabinet(CabinetRequest request) {
        return postEntity("admin/cabinets", request, CabinetResponse.class);
    }

    public CabinetResponse updateCabinet(Long id, CabinetRequest request) {
        return putEntity("admin/cabinets/" + id, request, CabinetResponse.class);
    }

    public void deleteCabinet(Long id) {
        deleteEntity(Microservice.GWY, "admin/cabinets/" + id);
    }

    public Integer count() {
        return (Integer) getObjectData(Microservice.GWY, "admin/cabinets/count");
    }
}
