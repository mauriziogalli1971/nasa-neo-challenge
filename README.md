# NASA Near Earth Objects (NEO) - Backend

## 🚀 Introduzione
Questo progetto costituisce il backend per l'applicazione di visualizzazione dei dati NASA relativi agli oggetti vicini alla Terra (NEO). Il sistema funge da middleware intelligente tra il frontend (React) e le API ufficiali della NASA, ottimizzando il flusso di dati e garantendo stabilità anche per richieste di intervalli temporali estesi.

L'obiettivo principale è permettere agli utenti di monitorare gli asteroidi che si avvicinano al nostro pianeta, fornendo dettagli tecnici e avvisi di potenziale pericolosità.

## 📋 Requisiti
Il sistema risponde ai seguenti requisiti funzionali:
- Recupero dei dati tramite l'endpoint NASA `neo/rest/v1/feed`.
- Filtraggio degli asteroidi per un intervallo di date (`start_date`, `end_date`).
- Visualizzazione dei dettagli tecnici per singolo asteroide tramite ID.
- Capacità di gestire richieste di dati superiori ai 7 giorni solari.

## ⚠️ Vincoli progettuali
Le API della NASA impongono alcune limitazioni che sono state gestite a livello architetturale:
1. **Range Temporale:** L'endpoint principale accetta un massimo di 7 giorni per singola chiamata.
2. **Rate Limiting:** Le API hanno un limite di chiamate per chiave (DEMO_KEY o chiave personale), superato il quale il servizio viene temporaneamente sospeso.
3. **Latenza di rete:** Le chiamate dirette alla NASA possono subire rallentamenti in base al carico dei server governativi.

## 💡 Soluzione Proposta
Per superare i vincoli sopra citati, il backend implementa le seguenti strategie:

### 1. Strategia di "Chunking"
Se l'utente richiede un intervallo superiore a 7 giorni (es. un mese intero), il backend suddivide automaticamente la richiesta in "chunk" (frammenti) di massimo 7 giorni ciascuno. Esegue le chiamate in sequenza ottimizzata e ricompone i dati in una lista piatta prima di inviarli al frontend, rendendo il limite della NASA invisibile all'utente finale.

### 2. Caching Multi-livello (Caffeine)
Per massimizzare le performance e rispettare i rate limit:
- **Liste Asteroidi:** Memorizzate per 6 ore (permettendo aggiornamenti frequenti della traiettoria).
- **Dettagli Singolo Asteroide:** Memorizzati per 7 giorni (trattandosi di dati fisici statici).
- **Politica di espulsione:** Basata su dimensione massima per prevenire l'esaurimento della memoria (Heap).

### 3. Gestione degli Errori e Validazione
- Validazione rigorosa delle date (ISO 8601) e dell'ordine cronologico.
- Global Exception Handler per mappare gli errori NASA (es. 429 Too Many Requests) in messaggi JSON chiari per il frontend.
- Utilizzo di `UriComponentsBuilder` per la costruzione sicura degli URL (encoding automatico).

## 🛠️ Stack Tecnologico
- **Java 21:** Scelto per le prestazioni e le moderne feature del linguaggio.
- **Spring Boot 3.x:** Framework core per la creazione di microservizi REST.
- **Caffeine Cache:** Libreria ad alte prestazioni per il caching in-memory.
- **Lombok:** Per la riduzione del boilerplate code nei modelli e DTO.
- **Maven:** Gestore delle dipendenze e del build lifecycle.
- **Railway.app:** Piattaforma scelta per il deployment in Cloud.