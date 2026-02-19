package ro.cabinetpro.cp_gwt.dto.cabinet;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CabinetRequest {

    // Cabinet
    private String name;
    private String address;
    private String phone;
    private String email;
    private String description;
    private String logoUrl;

    // Subscription
    private String planCode;
    private String subscriptionStatus;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate trialEndDate;

    private Boolean autoRenew;

    private BigDecimal price;
    private String currency;
}
