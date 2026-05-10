package pro.mauriziogalli.nasaneobackend.model.asteroid;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CloseApproachDatum {
    @JsonProperty("close_approach_date")
    private String closeApproachDate;

    @JsonProperty("close_approach_date_full")
    private String closeApproachDateFull;

    @JsonProperty("epoch_date_close_approach")
    private long epochDateCloseApproach;

    @JsonProperty("relative_velocity")
    private RelativeVelocityData relativeVelocityData;

    @JsonProperty("miss_distance")
    private MissDistanceData missDistanceData;

    @JsonProperty("orbiting_body")
    private String orbitingBody;

    private static class RelativeVelocityData {
        @JsonProperty("kilometers_per_second")
        private double kilometersPerSecond;

        @JsonProperty("kilometers_per_hour")
        private double kilometersPerHour;

        @JsonProperty("miles_per_hour")
        private double milesPerHour;
    }

    private static class MissDistanceData {
        @JsonProperty("astronomical")
        private double astronomical;

        @JsonProperty("lunar")
        private double lunar;

        @JsonProperty("kilometers")
        private double kilometers;

        @JsonProperty("miles")
        private double miles;
    }
}
