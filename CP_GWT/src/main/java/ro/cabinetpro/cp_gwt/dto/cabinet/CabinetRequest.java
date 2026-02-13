package ro.cabinetpro.cp_gwt.dto.cabinet;

import lombok.Data;

@Data
public class CabinetRequest {
    private String name;
    private String address;
    private String description;
    private String phone;
    private String email;
    private boolean active;
}
