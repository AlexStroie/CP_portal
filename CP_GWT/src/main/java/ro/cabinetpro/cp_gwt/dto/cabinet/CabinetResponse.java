package ro.cabinetpro.cp_gwt.dto.cabinet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import ro.cabinetpro.cp_gwt.dto.types.AbstractDTO;
import ro.cabinetpro.cp_gwt.dto.types.MicroserviceAware;
import ro.cabinetpro.cp_gwt.ms.Microservice;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CabinetResponse extends AbstractDTO implements MicroserviceAware {

    private Long id;

    private String name;
    private String address;
    private String phone;
    private String email;
    private String description;

    private String planCode;
    private String subscriptionStatus;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime trialEndDate;

    private String createdAt;

    private Integer maxUsers;
    private Integer maxPatients;

    private BigDecimal price;
    private String currency;

    private String logoUrl;
    private boolean autoRenew;

    @Override
    @JsonIgnore
    public Microservice getMicroservice() {
        return Microservice.GWY;
    }
}
