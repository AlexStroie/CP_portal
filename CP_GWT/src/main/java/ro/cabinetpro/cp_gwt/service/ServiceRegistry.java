package ro.cabinetpro.cp_gwt.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ro.cabinetpro.cp_gwt.ms.Microservice;

@Service
public class ServiceRegistry {

    @Value("${cp.gwy.base-url}")
    private String usrBaseUrl;

    public String getServiceUrl(Microservice ms) {
        return switch (ms) {
            case GWY -> usrBaseUrl;
        };
    }
}
