package ro.cabinetpro.cp_gwt.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.cabinetpro.cp_gwt.dto.cabinet.CabinetRequest;
import ro.cabinetpro.cp_gwt.dto.cabinet.CabinetResponse;
import ro.cabinetpro.cp_gwt.service.CabinetService;

import java.util.List;

@RestController
@RequestMapping("/web/v1/api/admin/cabinets")
@RequiredArgsConstructor
public class CabinetController {

    private final CabinetService cabinetService;

    @GetMapping
    public List<CabinetResponse> getAll() {
        return cabinetService.getAllCabinets();
    }

    @GetMapping("/{id}")
    public CabinetResponse getOne(@PathVariable Long id) {
        return cabinetService.getCabinet(id);
    }

    @PostMapping
    public CabinetResponse create(@RequestBody CabinetRequest req) {
        return cabinetService.createCabinet(req);
    }

    @PutMapping("/{id}")
    public CabinetResponse update(@PathVariable Long id, @RequestBody CabinetRequest req) {
        return cabinetService.updateCabinet(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        cabinetService.deleteCabinet(id);
    }
}
