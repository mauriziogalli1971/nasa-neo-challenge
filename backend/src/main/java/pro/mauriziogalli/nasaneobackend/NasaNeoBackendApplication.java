package pro.mauriziogalli.nasaneobackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Applicazione Spring Boot principale.
 * @see <a href="https://arkemis.it/challenges/nasa-neo">...</a>
 * @author Maurizio Galli
 */
@SpringBootApplication
@EnableCaching
public class NasaNeoBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(NasaNeoBackendApplication.class, args);
    }

}
