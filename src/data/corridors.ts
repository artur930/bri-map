export interface Corridor {
  id: string;
  name: string;
  shortName: string;
  color: string;
  projectCount: number;
  coordinates: [number, number][];
  dashed: boolean;
  weight: number;
}

export const CORRIDORS: Corridor[] = [
  {
    id: 'cpec',
    name: 'China–Pakistan Economic Corridor',
    shortName: 'CPEC',
    color: '#f97316',
    projectCount: 6,
    coordinates: [
      [39.9, 116.4], [34.3, 108.9], [39.4, 75.9],
      [33.7, 73.1], [24.9, 67.0], [25.1, 62.3],
    ],
    dashed: false,
    weight: 2.5,
  },
  {
    id: 'cmr',
    name: 'China–Mongolia–Russia Corridor',
    shortName: 'CMR',
    color: '#8b5cf6',
    projectCount: 2,
    coordinates: [
      [39.9, 116.4], [47.9, 106.9], [52.3, 104.3], [55.7, 37.6],
    ],
    dashed: false,
    weight: 2.5,
  },
  {
    id: 'nelb',
    name: 'New Eurasian Land Bridge',
    shortName: 'NELB',
    color: '#eab308',
    projectCount: 1,
    coordinates: [
      [31.2, 121.5], [34.7, 113.6], [34.3, 108.9], [43.8, 87.6],
      [43.2, 76.9], [41.3, 69.2], [35.7, 51.4], [41.0, 28.9], [51.9, 4.5],
    ],
    dashed: false,
    weight: 2.5,
  },
  {
    id: 'ccwa',
    name: 'China–Central–West Asia Corridor',
    shortName: 'CCWA',
    color: '#22c55e',
    projectCount: 1,
    coordinates: [
      [39.4, 75.9], [42.9, 74.6], [38.6, 68.8],
      [35.7, 51.4], [41.0, 28.9], [48.2, 16.4],
    ],
    dashed: false,
    weight: 2.5,
  },
  {
    id: 'cipc',
    name: 'China–Indochina Peninsula Corridor',
    shortName: 'CIPC',
    color: '#3b82f6',
    projectCount: 3,
    coordinates: [
      [25.0, 102.7], [17.9, 102.6], [13.7, 100.5], [3.1, 101.7], [1.3, 103.8],
    ],
    dashed: false,
    weight: 2.5,
  },
  {
    id: 'bcim',
    name: 'Bangladesh–China–India–Myanmar',
    shortName: 'BCIM',
    color: '#a16207',
    projectCount: 1,
    coordinates: [
      [25.0, 102.7], [21.9, 96.1], [23.7, 90.4], [22.6, 88.4],
    ],
    dashed: false,
    weight: 2.5,
  },
  {
    id: 'msr',
    name: '21st-Century Maritime Silk Road',
    shortName: 'MSR',
    color: '#06b6d4',
    projectCount: 21,
    coordinates: [
      [31.2, 121.5], [23.1, 113.3], [6.9, 79.9], [-4.0, 39.7],
      [11.6, 43.1], [30.0, 32.5], [37.9, 23.7], [45.4, 12.3],
    ],
    dashed: true,
    weight: 2.5,
  },
];
