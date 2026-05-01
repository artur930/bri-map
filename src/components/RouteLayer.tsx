'use client';

import { useEffect } from 'react';
import { Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Route } from '@/types';

interface RouteLayerProps {
    routes: Route[];
    visibleTypes: Set<string>;
}

const STATUS_DASH: Record<string, string> = {
    operational: '',
    under_construction: '10, 8',
    planned: '4, 8',
};

// Color palette - light beige/orange/white theme
const ROUTE_COLORS = {
    maritime_dot: '#1a6fa8',
    maritime_trail: '#5aaee0',
    land_dot: '#d4620a',
    land_trail: '#f4a053',
    construction_dot: '#c07820',
    planned_dot: '#a08040',
};

// Enhanced animated flow with multiple dots creating a "convoy" effect
function AnimatedFlowDot({
    route,
    animDelay = 0,
}: {
    route: Route;
    animDelay?: number;
}) {
    const map = useMap();

  useEffect(() => {
        if (!map) return;

                const points = route.waypoints.map((wp) => {
                        const p = map.latLngToLayerPoint(L.latLng(wp[0], wp[1]));
                        return p;
                });

                if (points.length < 2) return;

                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = 'position:absolute;overflow:visible;left:0;top:0;pointer-events:none;z-index:400;width:100%;height:100%';

                // Determine colors based on route type and status
                const isMaritime = route.type === 'maritime';
        const isOperational = route.status === 'operational';
        const dotColor = isMaritime ? ROUTE_COLORS.maritime_dot : ROUTE_COLORS.land_dot;
        const trailColor = isMaritime ? ROUTE_COLORS.maritime_trail : ROUTE_COLORS.land_trail;
        const baseDur = isMaritime ? 12 : 8;

                const buildPath = (pts: { x: number; y: number }[]) =>
                        pts.map((p, i) => (i === 0 ? 'M ' + p.x + ' ' + p.y : 'L ' + p.x + ' ' + p.y)).join(' ');

                // Add SVG defs for glow filter
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filterId = 'glow-' + route.id;
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', filterId);
        filter.setAttribute('x', '-50%');
        filter.setAttribute('y', '-50%');
        filter.setAttribute('width', '200%');
        filter.setAttribute('height', '200%');
        const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        feGaussianBlur.setAttribute('stdDeviation', isOperational ? '2.5' : '1.5');
        feGaussianBlur.setAttribute('result', 'coloredBlur');
        const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode1.setAttribute('in', 'coloredBlur');
        const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode2.setAttribute('in', 'SourceGraphic');
        feMerge.appendChild(feMergeNode1);
        feMerge.appendChild(feMergeNode2);
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feMerge);
        defs.appendChild(filter);
        svg.appendChild(defs);

                const pathId = 'fp-' + route.id + '-' + animDelay;
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('id', pathId);
        pathEl.setAttribute('d', buildPath(points));
        pathEl.setAttribute('fill', 'none');
        pathEl.setAttribute('stroke', 'none');
        svg.appendChild(pathEl);

                const makeAnimDot = (r: number, color: string, opacity: number, begin: string, dur: number) => {
                        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        c.setAttribute('r', String(r));
                        c.setAttribute('fill', color);
                        c.setAttribute('opacity', String(opacity));
                        c.setAttribute('filter', `url(#${filterId})`);
                        const am = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
                        am.setAttribute('dur', dur + 's');
                        am.setAttribute('repeatCount', 'indefinite');
                        am.setAttribute('begin', begin);
                        am.setAttribute('calcMode', 'linear');
                        const mp = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');
                        mp.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + pathId);
                        am.appendChild(mp);
                        c.appendChild(am);
                        return c;
                };

                // Number of dots depends on route status
                const numDots = isOperational ? 3 : 1;
        const dotSpacing = baseDur / numDots;

                for (let d = 0; d < numDots; d++) {
                        const offset = animDelay + d * dotSpacing;
                        // Leading dot - brighter and larger
          svg.appendChild(makeAnimDot(
                    isOperational ? 5.5 : 3.5,
                    dotColor,
                    isOperational ? 0.95 : 0.6,
                    offset + 's',
                    baseDur
                  ));
                        // Trail dot - slightly behind, softer color
          if (isOperational) {
                    svg.appendChild(makeAnimDot(3.5, trailColor, 0.6, (offset + 0.4) + 's', baseDur));
                    svg.appendChild(makeAnimDot(2, trailColor, 0.3, (offset + 0.9) + 's', baseDur));
          }
                }

                const pane = map.getPane('overlayPane');
        if (pane) pane.appendChild(svg);

                const updatePos = () => {
                        const newPts = route.waypoints.map((wp) => {
                                  const p = map.latLngToLayerPoint(L.latLng(wp[0], wp[1]));
                                  return p;
                        });
                        pathEl.setAttribute('d', buildPath(newPts));
                };

                map.on('zoom move zoomend moveend', updatePos);
        return () => {
                map.off('zoom move zoomend moveend', updatePos);
                if (svg.parentNode) svg.parentNode.removeChild(svg);
        };
  }, [map, route, animDelay]);

  return null;
}

export default function RouteLayer({ routes, visibleTypes }: RouteLayerProps) {
    const visibleRoutes = routes.filter((r) => visibleTypes.has(r.type));

  // Route line colors adjusted for light theme
  const getRouteColor = (route: Route) => {
        if (route.type === 'maritime') {
                return route.status === 'operational' ? '#1565a0' : '#4a90c4';
        }
        // Land routes
        if (route.status === 'operational') return '#c85a0a';
        if (route.status === 'under_construction') return '#d4882a';
        return '#b0924a';
  };

  return (
        <>
          {visibleRoutes.map((route) => (
                  <Polyline
                              key={route.id}
                              positions={route.waypoints}
                              pathOptions={{
                                            color: getRouteColor(route),
                                            weight: route.type === 'maritime' ? 2.5 : 3,
                                            opacity: route.status === 'operational' ? 0.8 : 0.55,
                                            dashArray: STATUS_DASH[route.status] || undefined,
                                            lineJoin: 'round',
                                            lineCap: 'round',
                              }}
                            >
                            <Tooltip sticky>
                                        <div className="route-tooltip">
                                                      <strong>{route.name}</strong>strong>
                                                      <br />
                                                      <span style={{ textTransform: 'capitalize' }}>{route.type}</span>span>
                                          {' · '}
                                          {route.totalLength.toLocaleString()} {route.lengthUnit}
                                                      <br />
                                                      <span
                                                                        style={{
                                                                                            color:
                                                                                                                  route.status === 'operational'
                                                                                                                    ? '#16a34a'
                                                                                                                    : route.status === 'under_construction'
                                                                                                                    ? '#d97706'
                                                                                                                    : '#64748b',
                                                                                            textTransform: 'capitalize',
                                                                        }}
                                                                      >
                                                        {route.status.replace('_', ' ')}
                                                      </span>span>
                                        </div>div>
                            </Tooltip>Tooltip>
                  </Polyline>Polyline>
                ))}
          {visibleRoutes.map((route, i) => (
                  <AnimatedFlowDot key={'flow-' + route.id} route={route} animDelay={i * 1.2} />
                ))}
        </>>
      );
}</>
