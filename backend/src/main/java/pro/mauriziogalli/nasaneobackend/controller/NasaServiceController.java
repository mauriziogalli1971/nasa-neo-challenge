package pro.mauriziogalli.nasaneobackend.controller;

import org.springframework.web.bind.annotation.*;
import pro.mauriziogalli.nasaneobackend.model.Asteroid;
import pro.mauriziogalli.nasaneobackend.service.NasaService;
import java.util.List;

/**
 * Controller REST che espone gli endpoint per la consultazione degli asteroidi Near Earth.
 * <p>
 * Fornisce accesso ai dati filtrati per intervallo temporale o per identificativo singolo.
 * Include la configurazione CORS per permettere l'integrazione con il frontend.
 * </p>
 * @author Maurizio Galli
 */
@RestController
@RequestMapping("/api/v1/asteroids")
@CrossOrigin(origins = "*")
public class NasaServiceController {

    private final NasaService nasaService;

    public NasaServiceController(NasaService nasaService) {
        this.nasaService = nasaService;
    }

    /**
     * Endpoint per ottenere la lista degli asteroidi vicini alla Terra in un dato periodo.
     *
     * @param startDate Data inizio (ISO format YYYY-MM-DD).
     * @param endDate   Data fine (ISO format YYYY-MM-DD).
     * @return Lista di asteroidi trovati.
     */
    @GetMapping
    public List<Asteroid> getAsteroids(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return nasaService.fetchFeedChunks(startDate, endDate);
    }

    /**
     * Endpoint per ottenere i dettagli di un singolo asteroide.
     *
     * @param id ID univoco dell'asteroide.
     * @return Dettagli dell'asteroide richiesto.
     */
    @GetMapping("/{id}")
    public Asteroid getById(@PathVariable String id) {
        return nasaService.fetchAsteroidById(id);
    }
}