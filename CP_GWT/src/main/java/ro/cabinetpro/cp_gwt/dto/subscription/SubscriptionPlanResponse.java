package ro.cabinetpro.cp_gwt.dto.subscription;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import ro.cabinetpro.cp_gwt.dto.types.AbstractDTO;
import ro.cabinetpro.cp_gwt.dto.types.MicroserviceAware;
import ro.cabinetpro.cp_gwt.ms.Microservice;


import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionPlanResponse extends AbstractDTO implements MicroserviceAware {

    private Long id;
    private String code; // BRONZE, SILVER, GOLD, PLATINUM
    private String name;
    private Integer maxUsers;
    private Integer maxPatients;
    private BigDecimal price;
    private String currency;
    private LocalDateTime createdAt;


    @Override
    @JsonIgnore
    public Microservice getMicroservice() {
        return Microservice.GWY;
    }
}
