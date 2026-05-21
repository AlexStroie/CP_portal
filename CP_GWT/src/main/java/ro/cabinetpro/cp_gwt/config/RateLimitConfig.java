package ro.cabinetpro.cp_gwt.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class RateLimitConfig {

    @Bean
    public Cache<String, AtomicInteger> requestCounterCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofHours(1))
                .maximumSize(5000)
                .build();
    }

    @Bean
    public Cache<String, Boolean> blockedIpCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofHours(24))
                .maximumSize(2000)
                .build();
    }
}
