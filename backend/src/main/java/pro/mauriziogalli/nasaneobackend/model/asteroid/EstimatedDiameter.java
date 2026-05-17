package pro.mauriziogalli.nasaneobackend.model.asteroid;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public class EstimatedDiameter {

    @JsonProperty("kilometers")
    @JsonAlias("kilometers")
    private KilometersData kilometers;

    @JsonProperty("meters")
    @JsonAlias("meters")
    private MetersData meters;

    @JsonProperty("miles")
    @JsonAlias("miles")
    private MilesData miles;

    @JsonProperty("feet")
    @JsonAlias("feet")
    private FeetData feet;

    @Data
    public static class KilometersData {

        @JsonProperty("min")
        @JsonAlias("estimated_diameter_min")
        private double min;

        @JsonProperty("max")
        @JsonAlias("estimated_diameter_max")
        private double max;
    }

    @Data
    public static class MetersData {

        @JsonProperty("min")
        @JsonAlias("estimated_diameter_min")
        private double min;

        @JsonProperty("max")
        @JsonAlias("estimated_diameter_max")
        private double max;
    }

    @Data
    public static class MilesData {

        @JsonProperty("min")
        @JsonAlias("estimated_diameter_min")
        private double min;

        @JsonProperty("max")
        @JsonAlias("estimated_diameter_max")
        private double max;
    }

    @Data
    public static class FeetData {

        @JsonProperty("min")
        @JsonAlias("estimated_diameter_min")
        private double min;

        @JsonProperty("max")
        @JsonAlias("estimated_diameter_max")
        private double max;
    }
}
