export interface Asteroid {
  absoluteMagnitudeH: number;
  closeApproachData: CloseApproachDatum[];
  estimatedDiameter: EstimatedDiameter;
  id: string;
  name: string;
  nasaJplUrl: string;
  neoReferenceId: string;
  potentiallyHazardous: boolean;
  sentryObject: boolean;
}

export interface CloseApproachDatum {
  closeApproachDate: string;
  closeApproachDateFull: string;
  epochDateCloseApproach: number;
  missDistance: MissDistance;
  orbitingBody: string;
  relativeVelocity: RelativeVelocity;
}

export interface DiameterRange {
  min: number;
  max: number;
}

export interface EstimatedDiameter {
  feet: DiameterRange;
  kilometers: DiameterRange;
  meters: DiameterRange;
  miles: DiameterRange;
}

export interface MissDistance {
  astronomical: number;
  kilometers: number;
  lunar: number;
  miles: number;
}

export interface RelativeVelocity {
  kilometersPerHour: number;
  kilometersPerSecond: number;
  milesPerHour: number;
}

// Utile per gestire lo stato della ricerca nel frontend
export interface AsteroidSearchParams {
  startDate: string;
  endDate: string;
}
