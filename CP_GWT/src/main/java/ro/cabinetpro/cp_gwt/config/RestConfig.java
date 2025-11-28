package ro.cabinetpro.cp_gwt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestConfig {

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate rest = new RestTemplate();

        // set timeouts (important in gateway)
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectionRequestTimeout(5000);
        factory.setReadTimeout(5000);

        rest.setRequestFactory(factory);
        return rest;
    }
}
