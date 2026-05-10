package pro.mauriziogalli.nasaneobackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import pro.mauriziogalli.nasaneobackend.config.CacheConfig;
import pro.mauriziogalli.nasaneobackend.model.Asteroid;
import pro.mauriziogalli.nasaneobackend.model.NasaResponse;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

/**
 * Servizio per la gestione delle comunicazioni con le API NASA NeoWS (Near Earth Object Web Service).
 * <p>
 * Implementa strategie di:
 * <ul>
 * <li><b>Chunking:</b> suddivisione di intervalli di date superiori a 7 giorni in richieste multiple.</li>
 * <li><b>Caching:</b> memorizzazione dei risultati per ridurre il traffico verso la NASA e rispettare i rate limits.</li>
 * </ul>
 * </p>
 * @author Maurizio Galli
 */
@Service
@Slf4j
public class NasaService {

    @Autowired
    @Lazy
    private NasaService self;

    private static final String NASA_BASE_URL = "https://api.nasa.gov/neo/rest/v1";

    @Value("${nasa.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Recupera una lista di asteroidi in un intervallo di date, gestendo automaticamente
     * il limite NASA di 7 giorni tramite una strategia di chunking.
     *
     * @param start Data di inizio in formato YYYY-MM-DD.
     * @param end   Data di fine in formato YYYY-MM-DD.
     * @return Una lista "piatta" di oggetti {@link Asteroid} per l'intero periodo.
     * @throws org.springframework.web.server.ResponseStatusException se le date non sono valide o l'ordine è errato.
     */
    public List<Asteroid> fetchFeedChunks(String start, String end) {
        LocalDate startDate = parseDate(start, "inizio");
        LocalDate endDate = parseDate(end, "fine");


        if (startDate.isAfter(endDate)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La data di inizio non può essere successiva alla data di fine");
        }

        if (endDate.isAfter(startDate.plusDays(30))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'intervallo tra le date non può superare i 30 giorni");
        }

        List<Asteroid> allAsteroids = new ArrayList<>();

        LocalDate currentStart = startDate;
        int chunkIndex = 1;
        while (currentStart.isBefore(endDate) || currentStart.isEqual(endDate)) {
            // Calcoliamo la fine del chunk: o 6 giorni dopo l'inizio, o la data finale effettiva
            LocalDate currentEnd = currentStart.plusDays(6);
            if (currentEnd.isAfter(endDate)) {
                currentEnd = endDate;
            }

            // Chiamiamo il metodo cacheable per questo specifico pezzetto
            System.out.println("--- Chiamata cacheable per il chunk #" + chunkIndex + ": " + currentStart + " al " + currentEnd);
            List<Asteroid> chunk = self.fetchFeed(currentStart.toString(), currentEnd.toString());
            allAsteroids.addAll(chunk);

            // Spostiamo l'inizio al giorno dopo la fine del chunk attuale
            currentStart = currentEnd.plusDays(1);
            chunkIndex++;
        }

        return allAsteroids;
    }

    /**
     * Esegue la chiamata reale all'API NASA per un singolo chunk di date.
     * Il risultato viene memorizzato nella cache configurata in {@link pro.mauriziogalli.nasaneobackend.config.CacheConfig}.
     *
     * @param startDate Data inizio chunk.
     * @param endDate   Data fine chunk.
     * @return Lista di asteroidi per il chunk specifico.
     */
    @Cacheable(value = CacheConfig.CACHE_ASTEROIDS, key = "#startDate.concat('_').concat(#endDate)")
    public List<Asteroid> fetchFeed(String startDate, String endDate) {
        try {
            String NASA_URL = NASA_BASE_URL + "/feed";
            String url = UriComponentsBuilder.fromUriString(NASA_URL)
                    .queryParam("start_date", startDate)
                    .queryParam("end_date", endDate)
                    .queryParam("api_key", apiKey)
                    .toUriString();

            NasaResponse response = restTemplate.getForObject(url, NasaResponse.class);
            return (response != null && response.getNearEarthObjects() != null)
                    ? response.getNearEarthObjects().values().stream().flatMap(List::stream).toList()
                    : List.of();

        } catch (HttpClientErrorException.TooManyRequests e) {
            // Errore 429: Rate Limit superato
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Limite API NASA superato. Riprova più tardi o usa una chiave valida.");
        } catch (Exception e) {
            // Altri errori (es. 500 della NASA o 403 chiave errata)
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Errore nella comunicazione con la NASA");
        }
    }

    /**
     * Recupera i dettagli tecnici di un singolo asteroide tramite il suo ID univoco.
     *
     * @param id L'identificativo NASA dell'asteroide (es. "3542519").
     * @return Oggetto {@link Asteroid} contenente i dettagli.
     */
    @Cacheable(value = CacheConfig.CACHE_ASTEROID_DETAIL, key = "#id")
    public Asteroid fetchAsteroidById(String id) {
        // 1. Costruzione URL con UriComponentsBuilder
        String url = UriComponentsBuilder.fromUriString(NASA_BASE_URL + "/neo/" + id)
                .queryParam("api_key", apiKey)
                .toUriString();

        System.out.println("--- Chiamata API NASA (Dettaglio ID): " + id);

        try {
            // 2. Chiamata e mapping automatico su un singolo oggetto Asteroid
            return restTemplate.getForObject(url, Asteroid.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Asteroide con ID " + id + " non trovato.");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Errore nel recupero del dettaglio.");
        }
    }

    /**
     * Metodo helper per validare la singola data con log specifico
     */
    private LocalDate parseDate(String dateStr, String label) {
        try {
            return LocalDate.parse(dateStr);
        } catch (DateTimeParseException | NullPointerException e) {
            log.error("Errore di validazione: la data di {} ('{}') non è valida o è assente", label, dateStr);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La data di " + label + " non è valida: " + dateStr);
        }
    }
}