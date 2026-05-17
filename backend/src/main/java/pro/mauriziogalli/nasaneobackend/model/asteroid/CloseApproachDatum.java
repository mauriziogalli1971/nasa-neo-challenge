package pro.mauriziogalli.nasaneobackend.model.asteroid;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CloseApproachDatum {
    @JsonProperty("absoluteMagnitudeH")
    @JsonAlias("absolute_magnitude_h")
    private double absoluteMagnitudeH;

    @JsonProperty("closeApproachDate")
    @JsonAlias("close_approach_date")
    private String closeApproachDate;

    @JsonProperty("closeApproachDateFull")
    @JsonAlias("close_approach_date_full")
    private String closeApproachDateFull;

    @JsonProperty("epochDateCloseApproach")
    @JsonAlias("epoch_date_close_approach")
    private long epochDateCloseApproach;

    @JsonProperty("relativeVelocity")
    @JsonAlias("relative_velocity")
    private RelativeVelocityData relativeVelocityData;

    @JsonProperty("missDistance")
    @JsonAlias("miss_distance")
    private MissDistanceData missDistanceData;

    @JsonProperty("orbitingBody")
    @JsonAlias("orbiting_body")
    private String orbitingBody;

    private static class RelativeVelocityData {
        @JsonProperty("kilometersPerSecond")
        @JsonAlias("kilometers_per_second")
        private double kilometersPerSecond;

        @JsonProperty("kilometersPerHour")
        @JsonAlias("kilometers_per_hour")
        private double kilometersPerHour;

        @JsonProperty("milesPerHour")
        @JsonAlias("miles_per_hour")
        private double milesPerHour;
    }

    private static class MissDistanceData {
        @JsonProperty("astronomical")
        @JsonAlias("astronomical")
        private double astronomical;

        @JsonProperty("lunar")
        @JsonAlias("lunar")
        private double lunar;

        @JsonProperty("kilometers")
        @JsonAlias("kilometers")
        private double kilometers;

        @JsonProperty("miles")
        @JsonAlias("miles")
        private double miles;
    }
}
