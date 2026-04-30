export type MarkerType = 'port' | 'airport' | 'city';
export type RouteType = 'maritime' | 'land' | 'air';
export type StatusType = 'operational' | 'under_construction' | 'planned';

export interface Port {
  id: string;
  name: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  type: 'port';
  capacity: number;
  capacityUnit: string;
  status: StatusType;
  investment: number;
  investmentUnit: string;
  completionYear: number;
  description: string;
  facilities: string[];
  tradePartners: string[];
  region: string;
}

export interface Airport {
  id: string;
  name: string;
  iata: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  type: 'airport';
  cargoCapacity: number;
  cargoUnit: string;
  passengerCapacity: number;
  status: StatusType;
  investment: number;
  investmentUnit: string;
  description: string;
  routes: string[];
  region: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  type: 'city';
  population: number;
  gdp: number;
  gdpUnit: string;
  briRole: string;
  description: string;
  keyProjects: string[];
  region: string;
}

export interface Route {
  id: string;
  name: string;
  type: RouteType;
  color: string;
  description: string;
  totalLength: number;
  lengthUnit: string;
  keyPorts?: string[];
  waypoints: [number, number][];
  completionYear: number;
  status: StatusType;
  region: string;
}

export type MapFeature = Port | Airport | City;

export interface LayerVisibility {
  maritime: boolean;
  land: boolean;
  ports: boolean;
  airports: boolean;
  cities: boolean;
}

export interface RegionStats {
  name: string;
  countries: number;
  investment: number;
  investmentUnit: string;
  keyProjects: number;
  tradeShare: number;
  color: string;
  stats: {
    ports: number;
    airports: number;
    railways: number;
    highways: number;
  };
}

export interface OverviewStats {
  totalInvestment: number;
  investmentUnit: string;
  participatingCountries: number;
  projectsCompleted: number;
  projectsOngoing: number;
  tradeVolume: number;
  tradeUnit: string;
  jobsCreated: number;
  lastUpdated: string;
}
