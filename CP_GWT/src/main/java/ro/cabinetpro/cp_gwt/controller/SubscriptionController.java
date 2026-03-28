package ro.cabinetpro.cp_gwt.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.cabinetpro.cp_gwt.dto.subscription.SubscriptionPlanResponse;
import ro.cabinetpro.cp_gwt.service.SubscriptionService;

import java.util.List;

@RestController
@RequestMapping("/web/v1/api/admin/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/plans")
    public List<SubscriptionPlanResponse> getAllSubscriptionsPlans() {
        return subscriptionService.getSubscriptionsPlans();
    }
}
