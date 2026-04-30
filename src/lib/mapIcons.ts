import L from 'leaflet';

const createSvgIcon = (svgContent: string, size = 32) =>
  L.divIcon({
    html: svgContent,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });

export const portIcon = createSvgIcon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <circle cx="16" cy="16" r="14" fill="#0ea5e9" stroke="#fff" stroke-width="2.5"/>
    <text x="16" y="21" text-anchor="middle" font-size="14" fill="white" font-weight="bold" font-family="sans-serif">⚓</text>
  </svg>`
);

export const airportIcon = createSvgIcon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <circle cx="16" cy="16" r="14" fill="#8b5cf6" stroke="#fff" stroke-width="2.5"/>
    <text x="16" y="21" text-anchor="middle" font-size="14" fill="white" font-weight="bold" font-family="sans-serif">✈</text>
  </svg>`
);

export const cityIcon = createSvgIcon(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <circle cx="16" cy="16" r="14" fill="#f59e0b" stroke="#fff" stroke-width="2.5"/>
    <text x="16" y="21" text-anchor="middle" font-size="14" fill="white" font-weight="bold" font-family="sans-serif">🏙</text>
  </svg>`
);

export const getIcon = (type: 'port' | 'airport' | 'city') => {
  if (type === 'port') return portIcon;
  if (type === 'airport') return airportIcon;
  return cityIcon;
};
