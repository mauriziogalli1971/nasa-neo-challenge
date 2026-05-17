package pro.mauriziogalli.nasaneobackend.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * NasaResponse object
 * <p>Mappa la response JSON dall'API NASA in una Map Java</p>
 * @see <a href="https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY">...</a>
 * @author Maurizio Galli
 */
@Data
public class NasaResponse {

    @JsonProperty("nearEarthObjects")
    @JsonAlias("near_earth_objects")
    private Map<String, List<Asteroid>> nearEarthObjects;
}
