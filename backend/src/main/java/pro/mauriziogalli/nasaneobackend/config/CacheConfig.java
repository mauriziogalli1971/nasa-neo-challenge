package pro.mauriziogalli.nasaneobackend.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Classe di configurazione per la gestione del caching dell'applicazione.
 * <p>
 * Questa configurazione utilizza l'implementazione <b>Caffeine</b> per fornire un sistema
 * di caching in-memory ad alte prestazioni. Sono definiti TTL (Time To Live) differenziati
 * per ottimizzare il recupero dei dati dalle API NASA.
 * </p>
 * @author Maurizio Galli
 */
@Configuration
public class CacheConfig {

    public static final String CACHE_ASTEROIDS = "asteroids";
    public static final String CACHE_ASTEROID_DETAIL = "asteroid-detail";

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(CACHE_ASTEROIDS, CACHE_ASTEROID_DETAIL);

        // Cache per endpoint principale `https://api.nasa.gov/neo/rest/v1/feed`: 6 ore
        cacheManager.registerCustomCache(CACHE_ASTEROIDS,
                Caffeine.newBuilder()
                        .expireAfterWrite(6, TimeUnit.HOURS)
                        .maximumSize(500)
                        .build());

        // Cache per endpoint singolo asteroide `https://api.nasa.gov/neo/rest/v1/neo/{id}`: 7 giorni
        cacheManager.registerCustomCache(CACHE_ASTEROID_DETAIL,
                Caffeine.newBuilder()
                        .expireAfterWrite(7, TimeUnit.DAYS)
                        .maximumSize(1000)
                        .build());

        return cacheManager;
    }
}