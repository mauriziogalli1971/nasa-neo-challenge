package pro.mauriziogalli.nasaneobackend.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import pro.mauriziogalli.nasaneobackend.model.asteroid.CloseApproachDatum;
import pro.mauriziogalli.nasaneobackend.model.asteroid.EstimatedDiameter;

import java.io.Serializable;

/**
 * Data Transfer Object (DTO) che rappresenta un Near Earth Object (NEO).
 * <p>
 * Mappa i campi principali restituiti dalle API NASA, semplificando la struttura
 * per il consumo da parte del frontend React.
 * </p>
 * @author Maurizio Galli
 */
@Data
public class Asteroid implements Serializable {

    @JsonProperty("id")
    @JsonAlias("id")
    private String id;

    @JsonProperty("neoReferenceId")
    @JsonAlias("neo_reference_id")
    private String neoReferenceId;

    @JsonProperty("name")
    @JsonAlias("name")
    private String name;

    @JsonProperty("nasaJplUrl")
    @JsonAlias("nasa_jpl_url")
    private String nasaJplUrl;

    @JsonProperty("absoluteMagnitudeH")
    @JsonAlias("absolute_magnitude_h")
    private double absoluteMagnitude;

    @JsonProperty("estimatedDiameter")
    @JsonAlias("estimated_diameter")
    private EstimatedDiameter estimatedDiameter;

    @JsonProperty("isPotentiallyHazardous")
    @JsonAlias("is_potentially_hazardous_asteroid")
    private boolean isPotentiallyHazardous;

    @JsonProperty("closeApproachData")
    @JsonAlias("close_approach_data")
    private List<CloseApproachDatum> closeApproachData;

    @JsonProperty("isSentryObject")
    @JsonAlias("is_sentry_object")
    private boolean isSentryObject;
}

