package ro.cabinetpro.cp_gwt.service;

import com.github.benmanes.caffeine.cache.Cache;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class RateLimitService {

    private final Cache<String, AtomicInteger> requestCounterCache;
    private final Cache<String, Boolean> blockedIpCache;

    public void checkRateLimit(String action, String ip, int limit) {
        if (Boolean.TRUE.equals(blockedIpCache.getIfPresent(ip))) {
            throw new RuntimeException("IP blocked");
        }

        String key = action + ":" + ip;

        AtomicInteger counter = requestCounterCache.get(
                key,
                k -> new AtomicInteger(0)
        );

        int count = counter.incrementAndGet();

        if (count > limit) {
            blockedIpCache.put(ip, true);
            throw new RuntimeException("Too many requests");
        }
    }
}