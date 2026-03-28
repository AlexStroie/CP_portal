package ro.cabinetpro.cp_gwt.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.cabinetpro.cp_gwt.dto.subscription.SubscriptionPlanResponse;

import java.util.List;

@Service
public class SubscriptionService extends AbstractService {

    public SubscriptionService(RestTemplate restTemplate, ServiceRegistry registry) {
        super(restTemplate, registry);
    }

    public List<SubscriptionPlanResponse> getSubscriptionsPlans() {
        return getListEntity(SubscriptionPlanResponse.class, "admin/subscriptions/plans");
    }
}
