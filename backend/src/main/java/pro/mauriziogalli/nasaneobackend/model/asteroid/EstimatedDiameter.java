package pro.mauriziogalli.nasaneobackend.model.asteroid;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public class EstimatedDiameter {
    @JsonProperty("kilometers")
    private KilometersData kilometers;
    @JsonProperty("meters")
    private MetersData meters;
    @JsonProperty("miles")
    private MilesData miles;
    @JsonProperty("feet")
    private FeetData feet;

    @Data
    public static class KilometersData {
        @JsonProperty("estimated_diameter_min")
        private double min;
        @JsonProperty("estimated_diameter_max")
        private double max;
    }

    @Data
    public static class MetersData {
        @JsonProperty("estimated_diameter_min")
        private double min;
        @JsonProperty("estimated_diameter_max")
        private double max;
    }

    @Data
    public static class MilesData {
        @JsonProperty("estimated_diameter_min")
        private double min;
        @JsonProperty("estimated_diameter_max")
        private double max;
    }

    @Data
    public static class FeetData {
        @JsonProperty("estimated_diameter_min")
        private double min;
        @JsonProperty("estimated_diameter_max")
        private double max;
    }
}
