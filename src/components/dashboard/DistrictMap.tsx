import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.heat';
import type {
  DistrictPop,
  Facility,
  MapDisplay,
  ChoroplethMetric,
  BubbleMetric,
} from '@/types/dashboard';
import DistrictInfoCard from './DistrictInfoCard';
import {
  LocateFixed,
  Expand,
  Minimize,
  Home,
  ChevronDown,
  ChevronUp,
  Layers,
  Focus,
  Camera,
} from 'lucide-react';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';
import {
  facilityCompleteness,
  completenessClasses,
  COMPLETENESS_TOTAL,
} from '@/lib/dataCompleteness';
import MetricInfoTooltip, {
  METRIC_TOOLTIPS,
} from './MetricInfoTooltip';

const BANGLADESH_CENTER: [number, number] = [23.7, 90.35];
const BANGLADESH_ZOOM = 9.5;

const BANGLADESH_BOUNDS: L.LatLngBoundsExpression = [
  [20.5, 88.0],
  [26.7, 92.7],
];

const NO_DATA_FILL = '#9ca3af';

const TILE_LAYERS: Record<'light' | 'street' | 'satellite', string> = {
  light:
    'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=cb1_3i1u_1_b458457f2d7303ab5872f2b5',

  street:
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

  satellite:
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

function getMetricPalette(metric: ChoroplethMetric): string[] {
  switch (metric) {
    case 'facilities':
      return ['#EFF6FF', '#BFDBFE', '#60A5FA', '#2563EB', '#1E3A8A'];

    case 'population':
      return ['#F5F3FF', '#DDD6FE', '#A78BFA', '#7C3AED', '#4C1D95'];

    case 'facilitiesPer100k':
      return ['#ECFDF5', '#A7F3D0', '#34D399', '#059669', '#064E3B'];

    case 'povertyIndex':
      return ['#FEF2F2', '#FCA5A5', '#EF4444', '#B91C1C', '#7F1D1D'];

    case 'literacyRate':
      return ['#F0FDFA', '#99F6E4', '#2DD4BF', '#0D9488', '#134E4A'];

    case 'urbanPercent':
      return ['#FFF7ED', '#FED7AA', '#FB923C', '#EA580C', '#7C2D12'];

    default:
      return ['#EFF6FF', '#BFDBFE', '#60A5FA', '#2563EB', '#1E3A8A'];
  }
}

function getMetricValue(
  d: DistrictPop,
  metric: ChoroplethMetric | BubbleMetric
): number {
  switch (metric) {
    case 'facilities':
      return d.total_facilities;

    case 'population':
      return d.Population;

    case 'facilitiesPer100k':
      return d.facilitiesPer100k || 0;

    case 'populationPerFacility':
      return d.populationPerFacility || 0;

    case 'povertyIndex':
      return d['Poverty Index'];

    case 'literacyRate':
      return d.Literacy_rate;

    case 'urbanPercent':
      return d.Urban_percent;

    default:
      return d.total_facilities;
  }
}

function quantileBreaks(values: number[], n: number): number[] {
  if (!values.length) return [];

  const sorted = [...values].sort((a, b) => a - b);
  const breaks: number[] = [];

  for (let i = 1; i < n; i++) {
    const idx = Math.floor((i / n) * sorted.length);
    breaks.push(sorted[Math.min(idx, sorted.length - 1)]);
  }

  return breaks;
}

function getQuantileColor(
  value: number,
  breaks: number[],
  palette: string[]
): string {
  if (!palette.length) return '#cbd5e1';

  for (let i = 0; i < breaks.length; i++) {
    if (value <= breaks[i]) return palette[i];
  }

  return palette[palette.length - 1];
}

function safeMinMax(arr: number[]): { min: number; max: number } {
  if (!arr.length) return { min: 0, max: 0 };

  let min = arr[0];
  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    const v = arr[i];

    if (v < min) min = v;
    if (v > max) max = v;
  }

  return { min, max };
}

function getMentalHealthFacilityIcon() {
  return L.divIcon({
    className: 'mental-health-facility-marker-wrapper',

    html: `
      <div class="mental-health-facility-marker">
        <svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true">

          <rect
            x="12"
            y="22"
            width="40"
            height="30"
            rx="3"
            fill="#cbd5e1"
            stroke="#111827"
            stroke-width="2.2"
          />

          <rect
            x="24"
            y="40"
            width="16"
            height="12"
            rx="1.5"
            fill="#60a5fa"
            stroke="#111827"
            stroke-width="2"
          />

          <rect
            x="17"
            y="27"
            width="6"
            height="11"
            rx="1"
            fill="#60a5fa"
            stroke="#111827"
            stroke-width="1.6"
          />

          <rect
            x="25"
            y="27"
            width="6"
            height="11"
            rx="1"
            fill="#60a5fa"
            stroke="#111827"
            stroke-width="1.6"
          />

          <rect
            x="33"
            y="27"
            width="6"
            height="11"
            rx="1"
            fill="#60a5fa"
            stroke="#111827"
            stroke-width="1.6"
          />

          <rect
            x="41"
            y="27"
            width="6"
            height="11"
            rx="1"
            fill="#60a5fa"
            stroke="#111827"
            stroke-width="1.6"
          />

          <rect
            x="20"
            y="36"
            width="24"
            height="4"
            rx="1"
            fill="#f472b6"
            stroke="#111827"
            stroke-width="1.6"
          />

          <rect
            x="12"
            y="18"
            width="40"
            height="4"
            fill="#7dd3fc"
            stroke="#111827"
            stroke-width="1.6"
          />

          <path
            d="M32 8 C28 4,20 6,20 14 C20 20,32 28,32 28 C32 28,44 20,44 14 C44 6,36 4,32 8Z"
            fill="#fb7185"
            stroke="#111827"
            stroke-width="2"
          />

          <rect
            x="30"
            y="11.5"
            width="4"
            height="9"
            rx="1"
            fill="#ffffff"
            stroke="#111827"
            stroke-width="1"
          />

          <rect
            x="27.5"
            y="14"
            width="9"
            height="4"
            rx="1"
            fill="#ffffff"
            stroke="#111827"
            stroke-width="1"
          />

        </svg>
      </div>
    `,

    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  });
}

function metricLabel(metric: ChoroplethMetric) {
  switch (metric) {
    case 'facilities':
      return 'Total Facilities';

    case 'population':
      return 'Population';

    case 'facilitiesPer100k':
      return 'Facilities per 100K';

    case 'povertyIndex':
      return 'Poverty Index';

    case 'literacyRate':
      return 'Literacy Rate';

    case 'urbanPercent':
      return 'Urban Percent';

    default:
      return 'Metric';
  }
}

function formatRangeValue(value: number, metric: ChoroplethMetric) {
  if (!Number.isFinite(value)) return '0';

  if (metric === 'population') {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }

    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)}K`;
    }

    return value.toFixed(0);
  }

  if (metric === 'literacyRate' || metric === 'urbanPercent') {
    return `${value.toFixed(1)}%`;
  }

  return value.toFixed(2).replace(/\.00$/, '');
}

interface DistrictMapProps {
  geojson: any;
  districts: DistrictPop[];
  facilities: Facility[];
  mapDisplay: MapDisplay;

  updateMapDisplay: <K extends keyof MapDisplay>(
    key: K,
    value: MapDisplay[K]
  ) => void;

  selectedDistrict: string | null;

  onDistrictClick: (code: string | null) => void;
}

export default function DistrictMap({
  geojson,
  districts,
  facilities,
  mapDisplay,
  updateMapDisplay,
  selectedDistrict,
  onDistrictClick,
}: DistrictMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const geoLayerRef = useRef<L.GeoJSON | null>(null);

  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  const heatRef = useRef<any>(null);

  const bubbleRef = useRef<L.LayerGroup | null>(null);

  const labelRef = useRef<L.LayerGroup | null>(null);

  const userMarkerRef = useRef<L.Marker | null>(null);

  const tileRef = useRef<L.TileLayer | null>(null);

  const lastSelectionRef = useRef<string | null>(null);

  const [basemap, setBasemap] =
    useState<'light' | 'street' | 'satellite'>('light');

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [locationError, setLocationError] =
    useState<string | null>(null);

  const [legendOpen, setLegendOpen] = useState(true);

  const [layersOpen, setLayersOpen] = useState(false);

  const [isolateView, setIsolateView] = useState(false);

  const activeDistrictCodes = useMemo(
    () => new Set(districts.map((d) => d.DIS_CODE)),
    [districts]
  );

  const totalGeoDistricts = geojson?.features?.length ?? 0;

  const hasActiveFilter =
    activeDistrictCodes.size > 0 &&
    activeDistrictCodes.size < totalGeoDistricts;

  useEffect(() => {
    if (isolateView && !hasActiveFilter) {
      setIsolateView(false);
    }
  }, [isolateView, hasActiveFilter]);

  const districtMap = useMemo(() => {
    const m = new Map<string, DistrictPop>();

    districts.forEach((d) => {
      m.set(d.DIS_CODE, d);
    });

    return m;
  }, [districts]);

  const centroidMap = useMemo(() => {
    const m = new Map<string, L.LatLng>();

    if (!geojson) return m;

    geojson.features.forEach((feat: any) => {
      const code = feat?.properties?.DIS_CODE;

      if (!code) return;

      try {
        const center =
          L.geoJSON(feat).getBounds().getCenter();

        m.set(code, center);
      } catch {
        //
      }
    });

    return m;
  }, [geojson]);

  const metricValues = useMemo(
    () =>
      districts.map((d) =>
        getMetricValue(
          d,
          mapDisplay.choroplethMetric
        )
      ),

    [
      districts,
      mapDisplay.choroplethMetric,
    ]
  );

  const metricRange = useMemo(
    () => safeMinMax(metricValues),
    [metricValues]
  );

  const breaks = useMemo(
    () => quantileBreaks(metricValues, 5),
    [metricValues]
  );

  const palette = useMemo(
    () =>
      getMetricPalette(
        mapDisplay.choroplethMetric
      ),

    [mapDisplay.choroplethMetric]
  );

  const selectedDistrictData = useMemo(() => {
    if (!selectedDistrict) return null;

    return (
      districtMap.get(selectedDistrict) ||
      null
    );
  }, [selectedDistrict, districtMap]);

  const fillOpacity =
    mapDisplay.showChoropleth &&
    mapDisplay.showMarkers
      ? 0.35

      : mapDisplay.showChoropleth
      ? 0.55

      : 0;

  useEffect(() => {
    const styleId =
      'district-map-custom-styles';

    if (
      document.getElementById(styleId)
    ) {
      return;
    }

    const style =
      document.createElement('style');

    style.id = styleId;

    style.innerHTML = `
      @keyframes userPulse {
        0% {
          transform: scale(0.8);
          opacity: 0.9;
        }

        70% {
          transform: scale(2.4);
          opacity: 0;
        }

        100% {
          transform: scale(2.4);
          opacity: 0;
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(4px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .mental-health-facility-marker-wrapper {
        background: transparent;
        border: none;
      }

      .mental-health-facility-marker {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(
          0 2px 3px rgba(0,0,0,0.24)
        );
      }

      .leaflet-tooltip.district-name-label {
        background: rgba(255,255,255,0.92);
        border: 1px solid rgba(148,163,184,0.55);
        color: #0f172a;
        box-shadow: none;
        font-size: 10px;
        font-weight: 600;
        padding: 2px 5px;
        border-radius: 5px;
      }

      .leaflet-tooltip.district-name-label::before {
        display: none;
      }

      .user-location-marker {
        position: relative;
        width: 20px;
        height: 20px;
      }

      .user-location-marker::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 9999px;
        background: rgba(37, 99, 235, 0.28);
        animation: userPulse 2s infinite;
      }

      .user-location-marker::after {
        content: "";
        position: absolute;
        left: 5px;
        top: 5px;
        width: 10px;
        height: 10px;
        border-radius: 9999px;
        background: #2563eb;
        border: 2px solid white;
        box-shadow:
          0 0 0 1px rgba(37,99,235,0.8),
          0 1px 5px rgba(0,0,0,0.25);
      }

      .district-map-card {
        animation:
          fadeInUp 180ms ease-out;
      }

      .district-map-wrapper:fullscreen {
        background: white;
      }

      .district-map-wrapper:fullscreen
      .district-map-main {
        height: 100vh !important;
      }

      .district-map-wrapper:fullscreen
      .leaflet-container {
        height: 100% !important;
      }
    `;

    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    const map = L.map(
      containerRef.current,
      {
        center: BANGLADESH_CENTER,
        zoom: BANGLADESH_ZOOM,
        zoomControl: false,
        attributionControl: true,
        preferCanvas: true,
        maxBounds: BANGLADESH_BOUNDS,
        maxBoundsViscosity: 0.25,
      }
    );

    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map);

    tileRef.current =
      L.tileLayer(TILE_LAYERS.light, {
        attribution:
          '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 20,
      }).addTo(map);

    mapRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => {
      map.remove();

      mapRef.current = null;

      tileRef.current = null;

      geoLayerRef.current = null;

      clusterRef.current = null;

      heatRef.current = null;

      bubbleRef.current = null;

      labelRef.current = null;

      userMarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (tileRef.current) {
      mapRef.current.removeLayer(
        tileRef.current
      );

      tileRef.current = null;
    }

    let attribution =
      '&copy; OpenStreetMap contributors';

    if (basemap === 'light') {
      attribution =
        '&copy; OpenStreetMap contributors &copy; CARTO';
    }

    if (basemap === 'satellite') {
      attribution =
        'Tiles &copy; Esri';
    }

    tileRef.current =
      L.tileLayer(
        TILE_LAYERS[basemap],
        {
          attribution,
          maxZoom:
            basemap === 'light'
              ? 20
              : 19,
        }
      ).addTo(mapRef.current);

  }, [basemap]);

  const resetMap = useCallback(() => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.setView(
      BANGLADESH_CENTER,
      BANGLADESH_ZOOM
    );

    onDistrictClick(null);
  }, [onDistrictClick]);

  const locateUser = useCallback(() => {
    if (
      !mapRef.current ||
      !navigator.geolocation
    ) {
      setLocationError(
        'Geolocation is not supported by this browser.'
      );

      return;
    }

    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mapRef.current) {
          return;
        }

        const {
          latitude,
          longitude,
        } = position.coords;

        const latlng =
          L.latLng(
            latitude,
            longitude
          );

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(
            latlng
          );
        } else {
          const icon =
            L.divIcon({
              className:
                'user-location-marker',
              html: '<div></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });

          userMarkerRef.current =
            L.marker(
              latlng,
              { icon }
            ).addTo(
              mapRef.current
            );
        }

        mapRef.current.setView(
          latlng,
          12
        );
      },

      () => {
        setLocationError(
          'Unable to access your location.'
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const toggleFullscreen =
    useCallback(async () => {
      try {
        if (
          !document.fullscreenElement
        ) {
          await wrapperRef.current
            ?.requestFullscreen();

        } else {
          await document.exitFullscreen();
        }

      } catch {
        toast.error(
          'Fullscreen mode is not available.'
        );
      }
    }, []);

  useEffect(() => {
    const handleFullscreenChange =
      () => {
        const active =
          !!document.fullscreenElement;

        setIsFullscreen(active);

        setTimeout(() => {
          mapRef.current?.invalidateSize();
        }, 100);
      };

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  const captureMap =
    useCallback(async () => {
      if (!wrapperRef.current) {
        return;
      }

      try {
        const dataUrl = await toPng(
          wrapperRef.current,
          {
            cacheBust: true,
            pixelRatio: 2,
          }
        );

        const link =
          document.createElement('a');

        link.download =
          'monchitro-map.png';

        link.href = dataUrl;

        link.click();

        toast.success(
          'Map image saved.'
        );
      } catch {
        toast.error(
          'Could not export the map image.'
        );
      }
    }, []);

  useEffect(() => {
    if (
      !mapRef.current ||
      !geojson
    ) {
      return;
    }

    const map = mapRef.current;

    if (geoLayerRef.current) {
      map.removeLayer(
        geoLayerRef.current
      );

      geoLayerRef.current = null;
    }

    const styleFeature =
      (feature: any) => {
        const code =
          feature?.properties?.DIS_CODE;

        const district =
          districtMap.get(code);

        const isActive =
          activeDistrictCodes.has(code);

        const isSelected =
          selectedDistrict === code;

        if (
          isolateView &&
          hasActiveFilter &&
          !isActive
        ) {
          return {
            color: 'transparent',
            weight: 0,
            fillColor:
              'transparent',
            fillOpacity: 0,
          };
        }

        if (!district) {
          return {
            color: '#cbd5e1',
            weight: 0.8,
            fillColor:
              NO_DATA_FILL,
            fillOpacity:
              mapDisplay.showChoropleth
                ? 0.22
                : 0,
          };
        }

        const value =
          getMetricValue(
            district,
            mapDisplay.choroplethMetric
          );

        const fillColor =
          mapDisplay.showChoropleth
            ? getQuantileColor(
                value,
                breaks,
                palette
              )
            : '#ffffff';

        return {
          color:
            isSelected
              ? '#111827'
              : '#64748b',

          weight:
            isSelected
              ? 3
              : 1,

          fillColor,

          fillOpacity,
        };
      };

    const layer =
      L.geoJSON(
        geojson,
        {
          style: styleFeature,

          onEachFeature:
            (
              feature,
              polygon
            ) => {
              const code =
                feature?.properties
                  ?.DIS_CODE;

              const district =
                districtMap.get(code);

              const name =
                district?.DISTRICT ||
                feature?.properties
                  ?.DISTRICT ||
                feature?.properties
                  ?.district ||
                'District';

              polygon.bindTooltip(
                name,
                {
                  sticky: true,
                  direction:
                    'top',
                  className:
                    'district-name-label',
                }
              );

              polygon.on({
                mouseover:
                  (event) => {
                    const target =
                      event.target;

                    const isActive =
                      activeDistrictCodes.has(
                        code
                      );

                    if (
                      isolateView &&
                      hasActiveFilter &&
                      !isActive
                    ) {
                      return;
                    }

                    target.setStyle({
                      weight: 2.3,
                      color:
                        '#334155',
                    });

                    target.bringToFront();
                  },

                mouseout:
                  (event) => {
                    const target =
                      event.target;

                    target.setStyle(
                      styleFeature(
                        feature
                      )
                    );
                  },

                click:
                  () => {
                    const isActive =
                      activeDistrictCodes.has(
                        code
                      );

                    if (
                      !isActive
                    ) {
                      return;
                    }

                    onDistrictClick(
                      code
                    );
                  },
              });
            },
        }
      );

    layer.addTo(map);

    geoLayerRef.current =
      layer;

  }, [
    geojson,
    districtMap,
    activeDistrictCodes,
    selectedDistrict,
    mapDisplay.showChoropleth,
    mapDisplay.choroplethMetric,
    breaks,
    palette,
    fillOpacity,
    isolateView,
    hasActiveFilter,
    onDistrictClick,
  ]);

  useEffect(() => {
    if (
      !mapRef.current ||
      !geoLayerRef.current
    ) {
      return;
    }

    geoLayerRef.current.eachLayer(
      (layer: any) => {
        const feature =
          layer.feature;

        if (!feature) {
          return;
        }

        const code =
          feature?.properties?.DIS_CODE;

        const district =
          districtMap.get(code);

        const isActive =
          activeDistrictCodes.has(code);

        const isSelected =
          selectedDistrict === code;

        if (
          isolateView &&
          hasActiveFilter &&
          !isActive
        ) {
          layer.setStyle({
            color: 'transparent',
            weight: 0,
            fillColor:
              'transparent',
            fillOpacity: 0,
          });

          return;
        }

        if (!district) {
          layer.setStyle({
            color: '#cbd5e1',
            weight: 0.8,
            fillColor:
              NO_DATA_FILL,
            fillOpacity:
              mapDisplay.showChoropleth
                ? 0.22
                : 0,
          });

          return;
        }

        const value =
          getMetricValue(
            district,
            mapDisplay.choroplethMetric
          );

        layer.setStyle({
          color:
            isSelected
              ? '#111827'
              : '#64748b',

          weight:
            isSelected
              ? 3
              : 1,

          fillColor:
            mapDisplay.showChoropleth
              ? getQuantileColor(
                  value,
                  breaks,
                  palette
                )
              : '#ffffff',

          fillOpacity,
        });

        if (isSelected) {
          layer.bringToFront();
        }
      }
    );
  }, [
    districtMap,
    activeDistrictCodes,
    selectedDistrict,
    mapDisplay.showChoropleth,
    mapDisplay.choroplethMetric,
    breaks,
    palette,
    fillOpacity,
    isolateView,
    hasActiveFilter,
  ]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = mapRef.current;

    if (clusterRef.current) {
      map.removeLayer(
        clusterRef.current
      );

      clusterRef.current = null;
    }

    if (!mapDisplay.showMarkers) {
      return;
    }

    const cluster =
      L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 45,
      });

    const facilityIcon =
      getMentalHealthFacilityIcon();

    facilities.forEach(
      (facility) => {
        const lat =
          Number(
            facility.Latitude
          );

        const lng =
          Number(
            facility.Longitude
          );

        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng)
        ) {
          return;
        }

        const marker =
          L.marker(
            [lat, lng],
            {
              icon:
                facilityIcon,
            }
          );

        const districtName =
          facility.District ||
          facility.DISTRICT ||
          '';

        const name =
          facility.Facility_name ||
          facility.Name ||
          facility.name ||
          'Mental health facility';

        const type =
          facility.Facility_type ||
          facility.Type ||
          facility.type ||
          '';

        const ownership =
          facility.Ownership ||
          facility.ownership ||
          '';

        const phone =
          facility.Phone ||
          facility.phone ||
          '';

        const address =
          facility.Address ||
          facility.address ||
          '';

        marker.bindPopup(
          `
          <div style="
            min-width: 220px;
            font-family:
              Inter,
              ui-sans-serif,
              system-ui,
              sans-serif;
          ">

            <div style="
              font-size: 14px;
              font-weight: 700;
              line-height: 1.35;
              color: #0f172a;
              margin-bottom: 6px;
            ">
              ${name}
            </div>

            ${
              type
                ? `
                <div style="
                  font-size: 12px;
                  color: #475569;
                  margin-bottom: 3px;
                ">
                  <b>Type:</b>
                  ${type}
                </div>
              `
                : ''
            }

            ${
              ownership
                ? `
                <div style="
                  font-size: 12px;
                  color: #475569;
                  margin-bottom: 3px;
                ">
                  <b>Ownership:</b>
                  ${ownership}
                </div>
              `
                : ''
            }

            ${
              districtName
                ? `
                <div style="
                  font-size: 12px;
                  color: #475569;
                  margin-bottom: 3px;
                ">
                  <b>District:</b>
                  ${districtName}
                </div>
              `
                : ''
            }

            ${
              address
                ? `
                <div style="
                  font-size: 12px;
                  color: #475569;
                  margin-bottom: 3px;
                ">
                  <b>Address:</b>
                  ${address}
                </div>
              `
                : ''
            }

            ${
              phone
                ? `
                <div style="
                  font-size: 12px;
                  color: #475569;
                ">
                  <b>Phone:</b>
                  ${phone}
                </div>
              `
                : ''
            }

          </div>
          `
        );

        cluster.addLayer(
          marker
        );
      }
    );

    cluster.addTo(map);

    clusterRef.current =
      cluster;

  }, [
    facilities,
    mapDisplay.showMarkers,
  ]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = mapRef.current;

    if (heatRef.current) {
      map.removeLayer(
        heatRef.current
      );

      heatRef.current = null;
    }

    if (!mapDisplay.showHeatmap) {
      return;
    }

    const points =
      facilities
        .map(
          (facility) => {
            const lat =
              Number(
                facility.Latitude
              );

            const lng =
              Number(
                facility.Longitude
              );

            if (
              !Number.isFinite(lat) ||
              !Number.isFinite(lng)
            ) {
              return null;
            }

            return [
              lat,
              lng,
              0.8,
            ] as [
              number,
              number,
              number
            ];
          }
        )
        .filter(
          Boolean
        ) as [
          number,
          number,
          number
        ][];

    if (!points.length) {
      return;
    }

    heatRef.current =
      (L as any)
        .heatLayer(
          points,
          {
            radius: 25,
            blur: 20,
            maxZoom: 12,
            minOpacity: 0.25,
          }
        )
        .addTo(map);

  }, [
    facilities,
    mapDisplay.showHeatmap,
  ]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = mapRef.current;

    if (bubbleRef.current) {
      map.removeLayer(
        bubbleRef.current
      );

      bubbleRef.current = null;
    }

    if (!mapDisplay.showBubbles) {
      return;
    }

    const group =
      L.layerGroup();

    const values =
      districts.map(
        (d) =>
          getMetricValue(
            d,
            mapDisplay.bubbleMetric
          )
      );

    const { min, max } =
      safeMinMax(values);

    districts.forEach(
      (district) => {
        const center =
          centroidMap.get(
            district.DIS_CODE
          );

        if (!center) {
          return;
        }

        const value =
          getMetricValue(
            district,
            mapDisplay.bubbleMetric
          );

        let ratio = 0.5;

        if (max > min) {
          ratio =
            (value - min) /
            (max - min);
        }

        const radius =
          5 +
          Math.sqrt(
            Math.max(
              ratio,
              0
            )
          ) *
            18;

        const circle =
          L.circleMarker(
            center,
            {
              radius,
              fillColor:
                '#0f766e',
              color:
                '#134e4a',
              weight: 1,
              fillOpacity:
                0.45,
            }
          );

        circle.bindTooltip(
          `${district.DISTRICT}: ${value.toLocaleString()}`,
          {
            direction: 'top',
          }
        );

        circle.addTo(group);
      }
    );

    group.addTo(map);

    bubbleRef.current =
      group;

  }, [
    districts,
    centroidMap,
    mapDisplay.showBubbles,
    mapDisplay.bubbleMetric,
  ]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = mapRef.current;

    if (labelRef.current) {
      map.removeLayer(
        labelRef.current
      );

      labelRef.current = null;
    }

    if (!mapDisplay.showLabels) {
      return;
    }

    const group =
      L.layerGroup();

    districts.forEach(
      (district) => {
        const center =
          centroidMap.get(
            district.DIS_CODE
          );

        if (!center) {
          return;
        }

        const icon =
          L.divIcon({
            className:
              'district-static-label',

            html: `
              <div
                style="
                  font-size: 10px;
                  font-weight: 700;
                  color: #0f172a;
                  white-space: nowrap;
                  text-shadow:
                    -1px -1px 0 #fff,
                    1px -1px 0 #fff,
                    -1px 1px 0 #fff,
                    1px 1px 0 #fff;
                  pointer-events: none;
                "
              >
                ${district.DISTRICT}
              </div>
            `,

            iconSize:
              [100, 16],

            iconAnchor:
              [50, 8],
          });

        L.marker(
          center,
          {
            icon,
            interactive:
              false,
          }
        ).addTo(group);
      }
    );

    group.addTo(map);

    labelRef.current =
      group;

  }, [
    districts,
    centroidMap,
    mapDisplay.showLabels,
  ]);

  useEffect(() => {
    if (
      !mapRef.current ||
      !selectedDistrict
    ) {
      lastSelectionRef.current =
        selectedDistrict;

      return;
    }

    if (
      lastSelectionRef.current ===
      selectedDistrict
    ) {
      return;
    }

    lastSelectionRef.current =
      selectedDistrict;

    if (
      geoLayerRef.current
    ) {
      geoLayerRef.current.eachLayer(
        (layer: any) => {
          const code =
            layer?.feature
              ?.properties
              ?.DIS_CODE;

          if (
            code ===
            selectedDistrict
          ) {
            try {
              const bounds =
                layer.getBounds?.();

              if (
                bounds &&
                bounds.isValid()
              ) {
                mapRef.current?.fitBounds(
                  bounds,
                  {
                    padding:
                      [40, 40],
                    maxZoom:
                      10.5,
                  }
                );
              }
            } catch {
              //
            }
          }
        }
      );
    }

  }, [selectedDistrict]);

  const focusFilteredDistricts =
    useCallback(() => {
      if (
        !mapRef.current ||
        !geoLayerRef.current
      ) {
        return;
      }

      const bounds =
        L.latLngBounds([]);

      geoLayerRef.current.eachLayer(
        (layer: any) => {
          const code =
            layer?.feature
              ?.properties
              ?.DIS_CODE;

          if (
            !activeDistrictCodes.has(
              code
            )
          ) {
            return;
          }

          try {
            const b =
              layer.getBounds?.();

            if (
              b &&
              b.isValid()
            ) {
              bounds.extend(b);
            }
          } catch {
            //
          }
        }
      );

      if (bounds.isValid()) {
        mapRef.current.fitBounds(
          bounds,
          {
            padding:
              [30, 30],
          }
        );
      }
    }, [activeDistrictCodes]);

  const legendRanges =
    useMemo(() => {
      const out:
        {
          from: number;
          to: number;
          color: string;
        }[] = [];

      if (!metricValues.length) {
        return out;
      }

      const sorted =
        [...metricValues].sort(
          (a, b) => a - b
        );

      for (
        let i = 0;
        i < palette.length;
        i++
      ) {
        const from =
          i === 0
            ? sorted[0]
            : breaks[i - 1];

        const to =
          i <
          breaks.length
            ? breaks[i]
            : sorted[
                sorted.length - 1
              ];

        out.push({
          from,
          to,
          color:
            palette[i],
        });
      }

      return out;
    }, [
      metricValues,
      breaks,
      palette,
    ]);

  return (
    <div
      ref={wrapperRef}
      className="
        district-map-wrapper
        relative
        w-full
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div
        className="
          absolute
          left-3
          top-3
          z-[1000]
          flex
          flex-col
          gap-2
        "
      >
        <button
          type="button"
          onClick={resetMap}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
          "
          title="Reset map"
        >
          <Home size={17} />
        </button>

        <button
          type="button"
          onClick={locateUser}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
          "
          title="Find my location"
        >
          <LocateFixed
            size={17}
          />
        </button>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={
              focusFilteredDistricts
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-700
              shadow-sm
              transition
              hover:bg-slate-50
            "
            title="Focus filtered districts"
          >
            <Focus size={17} />
          </button>
        )}

        <button
          type="button"
          onClick={
            captureMap
          }
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
          "
          title="Save map image"
        >
          <Camera size={17} />
        </button>

        <button
          type="button"
          onClick={
            toggleFullscreen
          }
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
          "
          title={
            isFullscreen
              ? 'Exit fullscreen'
              : 'Fullscreen'
          }
        >
          {isFullscreen ? (
            <Minimize
              size={17}
            />
          ) : (
            <Expand
              size={17}
            />
          )}
        </button>
      </div>

      <div
        className="
          absolute
          right-3
          top-3
          z-[1000]
          w-[210px]
        "
      >
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white/95
            shadow-md
            backdrop-blur
          "
        >
          <button
            type="button"
            onClick={() =>
              setLayersOpen(
                (v) => !v
              )
            }
            className="
              flex
              w-full
              items-center
              justify-between
              px-3
              py-2.5
              text-left
              text-sm
              font-semibold
              text-slate-800
              hover:bg-slate-50
            "
          >
            <span
              className="
                flex
                items-center
                gap-2
              "
            >
              <Layers
                size={16}
              />

              Map layers
            </span>

            {layersOpen ? (
              <ChevronUp
                size={16}
              />
            ) : (
              <ChevronDown
                size={16}
              />
            )}
          </button>

          {layersOpen && (
            <div
              className="
                border-t
                border-slate-200
                p-3
              "
            >
              <div
                className="
                  mb-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Basemap
              </div>

              <div
                className="
                  grid
                  grid-cols-3
                  gap-1.5
                "
              >
                {(
                  [
                    'light',
                    'street',
                    'satellite',
                  ] as const
                ).map(
                  (option) => (
                    <button
                      type="button"
                      key={
                        option
                      }
                      onClick={() =>
                        setBasemap(
                          option
                        )
                      }
                      className={`
                        rounded-md
                        border
                        px-2
                        py-1.5
                        text-xs
                        font-medium
                        capitalize
                        transition

                        ${
                          basemap ===
                          option
                            ? `
                              border-blue-600
                              bg-blue-50
                              text-blue-700
                            `
                            : `
                              border-slate-200
                              bg-white
                              text-slate-600
                              hover:bg-slate-50
                            `
                        }
                      `}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>

              <div
                className="
                  my-3
                  border-t
                  border-slate-100
                "
              />

              <label
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  py-1.5
                  text-xs
                  text-slate-700
                "
              >
                <span>
                  Choropleth
                </span>

                <input
                  type="checkbox"
                  checked={
                    mapDisplay.showChoropleth
                  }
                  onChange={(
                    e
                  ) =>
                    updateMapDisplay(
                      'showChoropleth',
                      e.target.checked
                    )
                  }
                />
              </label>

              <label
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  py-1.5
                  text-xs
                  text-slate-700
                "
              >
                <span>
                  Facilities
                </span>

                <input
                  type="checkbox"
                  checked={
                    mapDisplay.showMarkers
                  }
                  onChange={(
                    e
                  ) =>
                    updateMapDisplay(
                      'showMarkers',
                      e.target.checked
                    )
                  }
                />
              </label>

              <label
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  py-1.5
                  text-xs
                  text-slate-700
                "
              >
                <span>
                  Heatmap
                </span>

                <input
                  type="checkbox"
                  checked={
                    mapDisplay.showHeatmap
                  }
                  onChange={(
                    e
                  ) =>
                    updateMapDisplay(
                      'showHeatmap',
                      e.target.checked
                    )
                  }
                />
              </label>

              <label
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  py-1.5
                  text-xs
                  text-slate-700
                "
              >
                <span>
                  Bubbles
                </span>

                <input
                  type="checkbox"
                  checked={
                    mapDisplay.showBubbles
                  }
                  onChange={(
                    e
                  ) =>
                    updateMapDisplay(
                      'showBubbles',
                      e.target.checked
                    )
                  }
                />
              </label>

              <label
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  py-1.5
                  text-xs
                  text-slate-700
                "
              >
                <span>
                  District labels
                </span>

                <input
                  type="checkbox"
                  checked={
                    mapDisplay.showLabels
                  }
                  onChange={(
                    e
                  ) =>
                    updateMapDisplay(
                      'showLabels',
                      e.target.checked
                    )
                  }
                />
              </label>

              {hasActiveFilter && (
                <label
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    py-1.5
                    text-xs
                    text-slate-700
                  "
                >
                  <span>
                    Isolate filtered districts
                  </span>

                  <input
                    type="checkbox"
                    checked={
                      isolateView
                    }
                    onChange={(
                      e
                    ) =>
                      setIsolateView(
                        e.target.checked
                      )
                    }
                  />
                </label>
              )}
            </div>
          )}
        </div>
      </div>

      {mapDisplay.showChoropleth && (
        <div
          className="
            absolute
            bottom-4
            left-4
            z-[900]
            w-[235px]
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white/95
            shadow-md
            backdrop-blur
          "
        >
          <button
            type="button"
            onClick={() =>
              setLegendOpen(
                (v) => !v
              )
            }
            className="
              flex
              w-full
              items-center
              justify-between
              px-3
              py-2.5
              text-left
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  font-semibold
                  text-slate-800
                "
              >
                {metricLabel(
                  mapDisplay.choroplethMetric
                )}

                <MetricInfoTooltip
                  text={
                    METRIC_TOOLTIPS[
                      mapDisplay
                        .choroplethMetric
                    ]
                  }
                />
              </div>

              <div
                className="
                  mt-0.5
                  text-[10px]
                  text-slate-500
                "
              >
                Quantile classes
              </div>
            </div>

            {legendOpen ? (
              <ChevronDown
                size={15}
              />
            ) : (
              <ChevronUp
                size={15}
              />
            )}
          </button>

          {legendOpen && (
            <div
              className="
                border-t
                border-slate-200
                px-3
                py-2.5
              "
            >
              <div
                className="
                  space-y-1.5
                "
              >
                {legendRanges.map(
                  (
                    range,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          h-3
                          w-5
                          rounded-sm
                          border
                          border-black/10
                        "
                        style={{
                          backgroundColor:
                            range.color,
                        }}
                      />

                      <span
                        className="
                          text-[10px]
                          text-slate-600
                        "
                      >
                        {formatRangeValue(
                          range.from,
                          mapDisplay.choroplethMetric
                        )}
                        {' – '}
                        {formatRangeValue(
                          range.to,
                          mapDisplay.choroplethMetric
                        )}
                      </span>
                    </div>
                  )
                )}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    pt-0.5
                  "
                >
                  <span
                    className="
                      h-3
                      w-5
                      rounded-sm
                      border
                      border-black/10
                    "
                    style={{
                      backgroundColor:
                        NO_DATA_FILL,
                      opacity: 0.35,
                    }}
                  />

                  <span
                    className="
                      text-[10px]
                      text-slate-500
                    "
                  >
                    No data
                  </span>
                </div>
              </div>

              <div
                className="
                  mt-2
                  border-t
                  border-slate-100
                  pt-2
                  text-[10px]
                  leading-relaxed
                  text-slate-500
                "
              >
                Range:{' '}
                {formatRangeValue(
                  metricRange.min,
                  mapDisplay.choroplethMetric
                )}
                {' – '}
                {formatRangeValue(
                  metricRange.max,
                  mapDisplay.choroplethMetric
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {locationError && (
        <div
          className="
            absolute
            bottom-4
            right-4
            z-[1000]
            max-w-[260px]
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-3
            py-2
            text-xs
            text-red-700
            shadow-sm
          "
        >
          {locationError}
        </div>
      )}

      <div
        ref={containerRef}
        className="
          district-map-main
          h-[68vh]
          min-h-[540px]
          w-full
          bg-slate-100
        "
      />

      {selectedDistrictData && (
        <div
          className="
            district-map-card
            absolute
            bottom-4
            right-4
            z-[950]
            w-[320px]
            max-w-[calc(100%-2rem)]
          "
        >
          <DistrictInfoCard
            district={
              selectedDistrictData
            }
            facilities={
              facilities.filter(
                (f) =>
                  String(
                    f.DIS_CODE ||
                    f.dis_code ||
                    ''
                  ) ===
                  String(
                    selectedDistrict
                  )
              )
            }
            completeness={{
              score:
                facilityCompleteness(
                  facilities.filter(
                    (f) =>
                      String(
                        f.DIS_CODE ||
                        f.dis_code ||
                        ''
                      ) ===
                      String(
                        selectedDistrict
                      )
                  )
                ),

              classes:
                completenessClasses,

              total:
                COMPLETENESS_TOTAL,
            }}
            onClose={() =>
              onDistrictClick(
                null
              )
            }
          />
        </div>
      )}
    </div>
  );
}
