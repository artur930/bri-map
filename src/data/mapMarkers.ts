export interface MapMarker {
  id: string;
  name: string;
  type: 'Port' | 'Rail Hub' | 'Capital' | 'Transit Hub' | 'Airport' | 'Industrial Zone';
  lat: number;
  lng: number;
  investment: string;
  status: 'Operational' | 'Under Construction' | 'Planned' | 'Suspended' | 'Partner Node' | 'Coordination Hub';
  corridor: string;
  corridorId: string;
  color: string;
  size: 'sm' | 'md' | 'lg';
  country: string;
  yearAdded: number;
}

export const MAP_MARKERS: MapMarker[] = [
  // Ports
  { id: 'shanghai', name: 'Shanghai', type: 'Port', lat: 31.2, lng: 121.5, investment: '$14.2B', status: 'Operational', corridor: 'Maritime Silk Road', corridorId: 'msr', color: '#06b6d4', size: 'lg', country: 'China', yearAdded: 2013 },
  { id: 'guangzhou', name: 'Guangzhou', type: 'Port', lat: 23.1, lng: 113.3, investment: '$3.8B', status: 'Operational', corridor: 'Maritime Silk Road', corridorId: 'msr', color: '#06b6d4', size: 'md', country: 'China', yearAdded: 2013 },
  { id: 'colombo', name: 'Colombo', type: 'Port', lat: 6.9, lng: 79.9, investment: '$1.4B', status: 'Operational', corridor: 'Maritime Silk Road', corridorId: 'msr', color: '#06b6d4', size: 'md', country: 'Sri Lanka', yearAdded: 2014 },
  { id: 'mombasa', name: 'Mombasa', type: 'Port', lat: -4.0, lng: 39.7, investment: '$480M', status: 'Operational', corridor: 'Maritime Silk Road', corridorId: 'msr', color: '#06b6d4', size: 'md', country: 'Kenya', yearAdded: 2014 },
  { id: 'gwadar', name: 'Gwadar', type: 'Port', lat: 25.1, lng: 62.3, investment: '$1.62B', status: 'Operational', corridor: 'CPEC', corridorId: 'cpec', color: '#f97316', size: 'lg', country: 'Pakistan', yearAdded: 2015 },
  { id: 'piraeus', name: 'Piraeus', type: 'Port', lat: 37.9, lng: 23.7, investment: '$4.3B', status: 'Operational', corridor: 'Maritime Silk Road', corridorId: 'msr', color: '#06b6d4', size: 'lg', country: 'Greece', yearAdded: 2016 },
  { id: 'venice', name: 'Venice', type: 'Port', lat: 45.4, lng: 12.3, investment: '$2.1B', status: 'Operational', corridor: 'Maritime Silk Road', corridorId: 'msr', color: '#06b6d4', size: 'md', country: 'Italy', yearAdded: 2019 },
  { id: 'djibouti', name: 'Djibouti', type: 'Port', lat: 11.6, lng: 43.1, investment: '$590M', status: 'Operational', corridor: 'Maritime Silk Road', corridorId: 'msr', color: '#06b6d4', size: 'md', country: 'Djibouti', yearAdded: 2017 },
  { id: 'rotterdam', name: 'Rotterdam', type: 'Port', lat: 51.9, lng: 4.5, investment: '$3.1B', status: 'Operational', corridor: 'New Eurasian Land Bridge', corridorId: 'nelb', color: '#eab308', size: 'lg', country: 'Netherlands', yearAdded: 2017 },
  { id: 'singapore', name: 'Singapore', type: 'Port', lat: 1.3, lng: 103.8, investment: '$8.7B', status: 'Operational', corridor: 'China–Indochina Peninsula', corridorId: 'cipc', color: '#3b82f6', size: 'lg', country: 'Singapore', yearAdded: 2013 },
  { id: 'karachi', name: 'Karachi', type: 'Port', lat: 24.9, lng: 67.0, investment: '$1.1B', status: 'Operational', corridor: 'CPEC', corridorId: 'cpec', color: '#f97316', size: 'md', country: 'Pakistan', yearAdded: 2015 },
  // Rail Hubs
  { id: 'chongqing', name: 'Chongqing', type: 'Rail Hub', lat: 29.5, lng: 106.5, investment: '$2.3B', status: 'Operational', corridor: 'New Eurasian Land Bridge', corridorId: 'nelb', color: '#eab308', size: 'md', country: 'China', yearAdded: 2014 },
  { id: 'xian', name: "Xi'an", type: 'Rail Hub', lat: 34.3, lng: 108.9, investment: '$1.8B', status: 'Operational', corridor: 'New Eurasian Land Bridge', corridorId: 'nelb', color: '#eab308', size: 'md', country: 'China', yearAdded: 2013 },
  { id: 'zhengzhou', name: 'Zhengzhou', type: 'Rail Hub', lat: 34.7, lng: 113.6, investment: '$2.1B', status: 'Operational', corridor: 'New Eurasian Land Bridge', corridorId: 'nelb', color: '#eab308', size: 'md', country: 'China', yearAdded: 2014 },
  { id: 'duisburg', name: 'Duisburg', type: 'Rail Hub', lat: 51.4, lng: 6.8, investment: '$890M', status: 'Operational', corridor: 'New Eurasian Land Bridge', corridorId: 'nelb', color: '#eab308', size: 'md', country: 'Germany', yearAdded: 2017 },
  { id: 'vientiane', name: 'Vientiane', type: 'Rail Hub', lat: 17.9, lng: 102.6, investment: '$1.1B', status: 'Operational', corridor: 'China–Indochina Peninsula', corridorId: 'cipc', color: '#3b82f6', size: 'md', country: 'Laos', yearAdded: 2021 },
  { id: 'nairobi', name: 'Nairobi', type: 'Rail Hub', lat: -1.3, lng: 36.8, investment: '$3.2B', status: 'Operational', corridor: 'Maritime Silk Road', corridorId: 'msr', color: '#06b6d4', size: 'md', country: 'Kenya', yearAdded: 2017 },
  // Key Cities
  { id: 'beijing', name: 'Beijing', type: 'Capital', lat: 39.9, lng: 116.4, investment: '$280B', status: 'Coordination Hub', corridor: 'Multiple', corridorId: 'cpec', color: '#ef4444', size: 'lg', country: 'China', yearAdded: 2013 },
  { id: 'urumqi', name: 'Urumqi', type: 'Transit Hub', lat: 43.8, lng: 87.6, investment: '$5.2B', status: 'Operational', corridor: 'New Eurasian Land Bridge', corridorId: 'nelb', color: '#eab308', size: 'md', country: 'China', yearAdded: 2015 },
  { id: 'kashgar', name: 'Kashgar', type: 'Transit Hub', lat: 39.4, lng: 75.9, investment: '$3.1B', status: 'Operational', corridor: 'CPEC', corridorId: 'cpec', color: '#f97316', size: 'md', country: 'China', yearAdded: 2015 },
  { id: 'moscow', name: 'Moscow', type: 'Capital', lat: 55.7, lng: 37.6, investment: '$45B', status: 'Partner Node', corridor: 'China–Mongolia–Russia', corridorId: 'cmr', color: '#8b5cf6', size: 'lg', country: 'Russia', yearAdded: 2015 },
  { id: 'istanbul', name: 'Istanbul', type: 'Transit Hub', lat: 41.0, lng: 28.9, investment: '$12B', status: 'Operational', corridor: 'NELB / CCWA', corridorId: 'nelb', color: '#eab308', size: 'lg', country: 'Turkey', yearAdded: 2015 },
  { id: 'ulaanbaatar', name: 'Ulaanbaatar', type: 'Transit Hub', lat: 47.9, lng: 106.9, investment: '$1.2B', status: 'Operational', corridor: 'China–Mongolia–Russia', corridorId: 'cmr', color: '#8b5cf6', size: 'md', country: 'Mongolia', yearAdded: 2016 },
  { id: 'almaty', name: 'Almaty', type: 'Transit Hub', lat: 43.2, lng: 76.9, investment: '$2.8B', status: 'Operational', corridor: 'New Eurasian Land Bridge', corridorId: 'nelb', color: '#eab308', size: 'md', country: 'Kazakhstan', yearAdded: 2016 },
  { id: 'tehran', name: 'Tehran', type: 'Transit Hub', lat: 35.7, lng: 51.4, investment: '$18B', status: 'Operational', corridor: 'NELB / CCWA', corridorId: 'ccwa', color: '#22c55e', size: 'md', country: 'Iran', yearAdded: 2016 },
  { id: 'kl', name: 'Kuala Lumpur', type: 'Transit Hub', lat: 3.1, lng: 101.7, investment: '$3.8B', status: 'Operational', corridor: 'China–Indochina Peninsula', corridorId: 'cipc', color: '#3b82f6', size: 'md', country: 'Malaysia', yearAdded: 2016 },
  { id: 'bangkok', name: 'Bangkok', type: 'Transit Hub', lat: 13.7, lng: 100.5, investment: '$5.5B', status: 'Operational', corridor: 'China–Indochina Peninsula', corridorId: 'cipc', color: '#3b82f6', size: 'md', country: 'Thailand', yearAdded: 2017 },
  { id: 'dhaka', name: 'Dhaka', type: 'Transit Hub', lat: 23.7, lng: 90.4, investment: '$2.1B', status: 'Under Construction', corridor: 'BCIM', corridorId: 'bcim', color: '#a16207', size: 'md', country: 'Bangladesh', yearAdded: 2018 },
  { id: 'mandalay', name: 'Mandalay', type: 'Transit Hub', lat: 21.9, lng: 96.1, investment: '$890M', status: 'Under Construction', corridor: 'BCIM', corridorId: 'bcim', color: '#a16207', size: 'sm', country: 'Myanmar', yearAdded: 2019 },
  { id: 'kolkata', name: 'Kolkata', type: 'Port', lat: 22.6, lng: 88.4, investment: '$1.4B', status: 'Planned', corridor: 'BCIM', corridorId: 'bcim', color: '#a16207', size: 'sm', country: 'India', yearAdded: 2020 },
  { id: 'vienna', name: 'Vienna', type: 'Transit Hub', lat: 48.2, lng: 16.4, investment: '$4.1B', status: 'Operational', corridor: 'China–Central–West Asia', corridorId: 'ccwa', color: '#22c55e', size: 'md', country: 'Austria', yearAdded: 2018 },
  { id: 'bishkek', name: 'Bishkek', type: 'Transit Hub', lat: 42.9, lng: 74.6, investment: '$780M', status: 'Operational', corridor: 'China–Central–West Asia', corridorId: 'ccwa', color: '#22c55e', size: 'sm', country: 'Kyrgyzstan', yearAdded: 2017 },
  { id: 'dushanbe', name: 'Dushanbe', type: 'Transit Hub', lat: 38.6, lng: 68.8, investment: '$620M', status: 'Operational', corridor: 'China–Central–West Asia', corridorId: 'ccwa', color: '#22c55e', size: 'sm', country: 'Tajikistan', yearAdded: 2017 },
  { id: 'islamabad', name: 'Islamabad', type: 'Capital', lat: 33.7, lng: 73.1, investment: '$520M', status: 'Operational', corridor: 'CPEC', corridorId: 'cpec', color: '#f97316', size: 'md', country: 'Pakistan', yearAdded: 2015 },
  { id: 'irkutsk', name: 'Irkutsk', type: 'Transit Hub', lat: 52.3, lng: 104.3, investment: '$1.1B', status: 'Operational', corridor: 'China–Mongolia–Russia', corridorId: 'cmr', color: '#8b5cf6', size: 'sm', country: 'Russia', yearAdded: 2016 },
];
