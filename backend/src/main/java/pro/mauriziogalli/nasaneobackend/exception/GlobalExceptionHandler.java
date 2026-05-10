package pro.mauriziogalli.nasaneobackend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

/**
 * Gestore globale delle eccezioni per l'applicazione.
 * <p>
 * Intercetta gli errori lanciati dai Service o dai Controller e li trasforma
 * in risposte JSON standardizzate per il frontend, evitando la fuga di stack trace tecnici.
 * </p>
 * @author Maurizio Galli
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Gestisce le eccezioni di tipo {@link ResponseStatusException}.
     * * @param ex L'eccezione catturata.
     * @return Un oggetto JSON contenente il messaggio d'errore e lo status HTTP appropriato.
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleNasaErrors(ResponseStatusException ex) {
        assert ex.getReason() != null;
        return ResponseEntity
                .status(ex.getStatusCode())
                .body(Map.of("error", ex.getReason()));
    }
}