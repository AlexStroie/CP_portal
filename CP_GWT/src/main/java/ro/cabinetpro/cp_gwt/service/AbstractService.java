package ro.cabinetpro.cp_gwt.service;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;
import ro.cabinetpro.cp_gwt.dto.AbstractTypeDTO;

public class AbstractService {

    private static final Logger log = LoggerFactory.getLogger(AbstractService.class);

    @Value("${gateway-services.service.url}")
    private String gatewayWebServiceURL;
    @Value("${gateway-services.service.port}")
    private String gatewayWebServicePort;


    protected <T extends AbstractTypeDTO> T postGatewayService(String command, Object request, Class<T> type) {
        if (request == null) {
            return null;
        }
        final String url = "http://" + gatewayWebServiceURL + ":" + gatewayWebServicePort + "/" + command;
        return postService(url, request, type);
    }

    private <T extends AbstractTypeDTO> T postService(String url, Object request, Class<T> type) {

        log.info("Sending request to: " + url);

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // Forward Authorization header if present
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attr != null) {
            HttpServletRequest incomingRequest = attr.getRequest();
            String authHeader = incomingRequest.getHeader("Authorization");
            if (authHeader != null) {
                headers.set("Authorization", authHeader);
            }
        }

        HttpEntity<Object> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<T> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    type
            );
            return response.getBody();
        } catch (HttpClientErrorException e) {
            // propagate status code and error body back to Angular
            throw new ResponseStatusException(
                    e.getStatusCode(),
                    e.getResponseBodyAsString()
            );

        } catch (Exception e) {
            log.error("Unexpected error forwarding request", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Gateway processing error");
        }
    }

}
