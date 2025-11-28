package ro.cabinetpro.cp_gwt.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import ro.cabinetpro.cp_gwt.dto.types.MicroserviceAware;
import ro.cabinetpro.cp_gwt.ms.Microservice;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
public abstract class AbstractService {

    private static final Logger log = LoggerFactory.getLogger(AbstractService.class);

    private final RestTemplate restTemplate;
    private final ServiceRegistry registry;

    /* ============ GET single ============ */

    protected <T extends MicroserviceAware> T getObjectEntity(Class<T> type, String command) {
        String url = buildUrl(type, command);
        log.info("[GWY] GET {}", url);

        try {
            return restTemplate.getForObject(url, type);
        } catch (HttpClientErrorException e) {
            throw translateClientException(e);
        } catch (RestClientException e) {
            log.error("[GWY] Error calling {}", url, e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Error contacting downstream service");
        }
    }

    /* ============ GET list ============ */

    protected <T extends MicroserviceAware> List<T> getListEntity(Class<T> type, String command) {
        String url = buildUrl(type, command);
        log.info("[GWY] GET LIST {}", url);
        SecurityContextHolder.getContext().getAuthentication();
        try {
            @SuppressWarnings("unchecked")
            Class<T[]> arrayType = (Class<T[]>) Array.newInstance(type, 0).getClass();
            T[] arr = restTemplate.getForObject(url, arrayType);
            return arr != null ? Arrays.asList(arr) : List.of();
        } catch (HttpClientErrorException e) {
            log.error("[GWY] Error calling {}", url, e);
            throw translateClientException(e);
        } catch (RestClientException e) {
            log.error("[GWY] Error calling {}", url, e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Error contacting downstream service");
        }
    }

    /* ============ POST with response ============ */

    protected <T extends MicroserviceAware> T postEntity(String command, Object body, Class<T> type) {
        if (body == null) {
            return null;
        }
        String url = buildUrl(type, command);
        log.info("[GWY] POST {}", url);

        try {
            return restTemplate.postForObject(url, body, type);
        } catch (HttpClientErrorException e) {
            throw translateClientException(e);
        } catch (RestClientException e) {
            log.error("[GWY] Error calling {}", url, e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Error contacting downstream service");
        }
    }

    /* ============ POST void ============ */

    protected void postVoid(Microservice ms, String command, Object body) {
        if (body == null) {
            return;
        }
        String url = registry.getServiceUrl(ms) + "/" + command;
        log.info("[GWY] POST (void) {}", url);

        try {
            restTemplate.postForEntity(url, body, Void.class);
        } catch (HttpClientErrorException e) {
            throw translateClientException(e);
        } catch (RestClientException e) {
            log.error("[GWY] Error calling {}", url, e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Error contacting downstream service");
        }
    }

    /* ============ PUT with response ============ */

    protected <T extends MicroserviceAware> T putEntity(String command, Object body, Class<T> type) {
        if (body == null) {
            return null;
        }
        String url = buildUrl(type, command);
        log.info("[GWY] PUT {}", url);

        HttpEntity<Object> entity = new HttpEntity<>(body);

        try {
            ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.PUT, entity, type);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            throw translateClientException(e);
        } catch (RestClientException e) {
            log.error("[GWY] Error calling {}", url, e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Error contacting downstream service");
        }
    }

    /* ============ DELETE ============ */

    protected void deleteEntity(Microservice ms, String command) {
        String url = registry.getServiceUrl(ms) + "/" + command;
        log.info("[GWY] DELETE {}", url);

        try {
            restTemplate.delete(url);
        } catch (HttpClientErrorException e) {
            throw translateClientException(e);
        } catch (RestClientException e) {
            log.error("[GWY] Error calling {}", url, e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Error contacting downstream service");
        }
    }

    /* ============ helper methods ============ */

    private RuntimeException translateClientException(HttpClientErrorException e) {
        return new ResponseStatusException(e.getStatusCode(), e.getResponseBodyAsString());
    }

    private <T extends MicroserviceAware> String buildUrl(Class<T> type, String command) {
        try {
            // folosim constructorul fără argumente ca să luăm microserviciul
            Microservice ms = type.getDeclaredConstructor().newInstance().getMicroservice();
            return registry.getServiceUrl(ms) + "/" + command;
        } catch (Exception e) {
            throw new RuntimeException("Cannot determine microservice for type " + type.getName(), e);
        }
    }
}
