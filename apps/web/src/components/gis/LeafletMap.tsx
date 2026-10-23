'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { GisWasteItem, GisOfftakerItem } from '@/lib/gis-data';
import { Layers, Maximize2, Compass, Map as MapIcon, Globe, Mountain, Droplets, Boxes, Building2 } from 'lucide-react';

interface LeafletMapProps {
  wastePoints: GisWasteItem[];
  offtakers: GisOfftakerItem[];
  selectedWaste: GisWasteItem | null;
  onSelectWaste: (item: GisWasteItem) => void;
  onSelectOfftaker?: (item: GisOfftakerItem) => void;
  radiusKm: number;
  showRadiusCircle: boolean;
  activeRouteStops?: GisWasteItem[];
}

type BasemapType = 'osm' | 'satellite' | 'topo';

export default function LeafletMap({
  wastePoints,
  offtakers,
  selectedWaste,
  onSelectWaste,
  onSelectOfftaker,
  radiusKm,
  showRadiusCircle,
  activeRouteStops = [],
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentTileLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const radiusCircleRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const truckMarkerRef = useRef<any>(null);
  const truckIntervalRef = useRef<any>(null);

  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('osm');

  // Inisialisasi peta Leaflet saat browser mount
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Hapus peta sebelumnya jika ada
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Inisialisasi peta Leaflet - Pusat di Sentra Karst Campurdarat & Besole
      const map = L.map(mapContainerRef.current, {
        center: [-8.175, 111.865],
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
      });

      // Kontrol Zoom di pojok kanan bawah
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Default Basemap: OpenStreetMap Standard (100% Free, Reliable, No "API KEY REQUIRED" Watermark)
      const osmTile = L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(map);

      currentTileLayerRef.current = osmTile;
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Invalidate size setelah DOM ter-render sempurna
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);

      const handleResize = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handler ganti basemap (OSM, Satelit Esri, Topo)
  const switchBasemap = async (type: BasemapType) => {
    if (!mapInstanceRef.current || typeof window === 'undefined') return;
    const L = (await import('leaflet')).default;
    const map = mapInstanceRef.current;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    let newTileLayer;
    if (type === 'satellite') {
      newTileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Citra Satelit Karst Tulungagung',
          maxZoom: 18,
        }
      );
    } else if (type === 'topo') {
      newTileLayer = L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        {
          attribution: 'Map data: &copy; OpenStreetMap, SRTM | Style: OpenTopoMap',
          maxZoom: 17,
        }
      );
    } else {
      newTileLayer = L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      );
    }

    newTileLayer.addTo(map);
    currentTileLayerRef.current = newTileLayer;
    setActiveBasemap(type);
  };

  // Tombol Fit Bounds (Pusatkan kembali ke seluruh titik)
  const handleFitBounds = async () => {
    if (!mapInstanceRef.current || typeof window === 'undefined' || wastePoints.length === 0) return;
    const L = (await import('leaflet')).default;
    const bounds = L.latLngBounds(wastePoints.map((w) => [w.latitude, w.longitude]));
    offtakers.forEach((o) => bounds.extend([o.latitude, o.longitude]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  };

  // Update Markers & Layer ketika data atau filter berubah
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === 'undefined') return;

    async function updateLayers() {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;
      const layerGroup = markersLayerRef.current;

      if (!map || !layerGroup) return;

      layerGroup.clearLayers();

      // 1. Gambar Radius Logistik Circle
      if (showRadiusCircle) {
        if (radiusCircleRef.current) {
          map.removeLayer(radiusCircleRef.current);
        }
        radiusCircleRef.current = L.circle([-8.1633, 111.8594], {
          radius: radiusKm * 1000,
          color: '#00236F',
          weight: 2.5,
          dashArray: '6, 8',
          fillColor: '#3B82F6',
          fillOpacity: 0.09,
        }).addTo(map);
      } else if (radiusCircleRef.current) {
        map.removeLayer(radiusCircleRef.current);
      }

      // 2. Custom Icon Generator
      const createCustomIcon = (
        colorHex: string,
        label: string,
        subLabel: string,
        isPulse: boolean = false
      ) => {
        return L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; user-select: none;">
              ${
                isPulse
                  ? `<div style="position: absolute; top: -3px; width: 38px; height: 38px; border-radius: 50%; background-color: ${colorHex}; opacity: 0.45; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                  : ''
              }
              <div style="width: 34px; height: 34px; border-radius: 50%; background-color: ${colorHex}; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 13px; z-index: 20; transition: transform 0.2s;">
                ${label}
              </div>
              <div style="margin-top: 3px; background: rgba(11, 28, 48, 0.95); backdrop-filter: blur(4px); color: white; padding: 2px 8px; border-radius: 8px; font-size: 10px; font-weight: 800; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.2);">
                ${subLabel}
              </div>
            </div>
          `,
          iconSize: [36, 52],
          iconAnchor: [18, 22],
        });
      };

      // 3. Render Titik Residu Limbah (Pin Hijau & Pin Oranye)
      wastePoints.forEach((waste) => {
        const isSludge = waste.wasteType === 'sludge_lumpur';
        const color = isSludge ? '#10B981' : '#F59E0B';
        const iconSvg = isSludge
          ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`
          : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
        const subLabel = `${waste.estimatedTonnage} Ton • ${waste.subdistrict}`;

        const marker = L.marker([waste.latitude, waste.longitude], {
          icon: createCustomIcon(color, iconSvg, subLabel, isSludge),
          zIndexOffset: isSludge ? 100 : 50,
        });

        marker.on('click', () => {
          onSelectWaste(waste);
        });

        marker.bindTooltip(
          `<div style="font-family: inherit; font-size: 12px;">
            <strong style="color: #00236F; font-size: 13px;">${waste.workshopName}</strong><br/>
            <span style="color: #64748B;">Residu:</span> <b>${
              isSludge ? 'Sludge Lumpur Kalsium' : 'Afur Kasar Bongkahan'
            }</b><br/>
            <span style="color: #64748B;">Tonase:</span> <b style="color: #10B981;">${waste.estimatedTonnage} Ton</b> (CaCO3 ${waste.caco3Pct}%)
          </div>`,
          { direction: 'top', offset: [0, -22], className: 'custom-tooltip' }
        );

        layerGroup.addLayer(marker);
      });

      // 4. Render Titik Pabrik Offtaker (Pin Ungu)
      offtakers.forEach((offtaker) => {
        const factorySvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>`;
        const marker = L.marker([offtaker.latitude, offtaker.longitude], {
          icon: createCustomIcon('#8B5CF6', factorySvg, offtaker.companyName.split(' ')[1] || 'Pabrik', false),
          zIndexOffset: 200,
        });

        marker.on('click', () => {
          if (onSelectOfftaker) onSelectOfftaker(offtaker);
        });

        marker.bindTooltip(
          `<div style="font-family: inherit; font-size: 12px;">
            <strong style="color: #6D28D9; font-size: 13px;">${offtaker.companyName}</strong><br/>
            <span style="color: #64748B;">Industri:</span> <b>${offtaker.industryType}</b><br/>
            <span style="color: #64748B;">Kapasitas Serap:</span> <b>${offtaker.weeklyCapacityTons} Ton/minggu</b>
          </div>`,
          { direction: 'top', offset: [0, -22] }
        );

        layerGroup.addLayer(marker);
      });

      // 5. Render Polyline Rute Penjemputan Multi-Stop & Animasi Truk Bergerak
      if (truckIntervalRef.current) {
        clearInterval(truckIntervalRef.current);
        truckIntervalRef.current = null;
      }
      if (truckMarkerRef.current && map) {
        map.removeLayer(truckMarkerRef.current);
        truckMarkerRef.current = null;
      }

      if (activeRouteStops.length > 0) {
        if (routePolylineRef.current) {
          map.removeLayer(routePolylineRef.current);
        }

        const offtakerPoint = [-8.132, 111.885]; // PT Sentosa Teraso Boyolangu
        const stopCoords: [number, number][] = [
          [offtakerPoint[0], offtakerPoint[1]],
          ...activeRouteStops.map((s): [number, number] => [s.latitude, s.longitude]),
          [offtakerPoint[0], offtakerPoint[1]],
        ];

        routePolylineRef.current = L.polyline(stopCoords, {
          color: '#00236F',
          weight: 4.5,
          opacity: 0.9,
          dashArray: '8, 8',
        }).addTo(map);

        // Tambahkan Marker Truk Bergerak Real-Time
        const truckIcon = L.divIcon({
          className: 'truck-animated-marker',
          html: `<div style="background: #00236F; color: #FDE047; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,35,111,0.6); border: 2.5px solid #38BDF8; transform: scale(1.1); transition: all 1s ease-in-out;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FDE047" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg></div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        let currentIdx = 0;
        const truckMarker = L.marker(stopCoords[0], {
          icon: truckIcon,
          zIndexOffset: 1000,
        }).addTo(map);

        truckMarker.bindTooltip(
          `<div style="font-size: 11px; font-weight: bold; color: #00236F;">
            <b>Armada AG 8492 UT</b> • Rute TSP Aktif<br/>
            <span style="color: #059669;">Kecepatan: 35 km/jam • Status: Menjemput Residu</span>
          </div>`,
          { permanent: false, direction: 'top', offset: [0, -18] }
        );

        truckMarkerRef.current = truckMarker;

        truckIntervalRef.current = setInterval(() => {
          currentIdx = (currentIdx + 1) % stopCoords.length;
          truckMarker.setLatLng(stopCoords[currentIdx]);
        }, 2500);
      } else if (routePolylineRef.current) {
        map.removeLayer(routePolylineRef.current);
      }
    }

    updateLayers();
  }, [wastePoints, offtakers, radiusKm, showRadiusCircle, activeRouteStops, onSelectWaste, onSelectOfftaker]);

  // Efek fokus ke titik limbah yang dipilih
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedWaste) return;
    mapInstanceRef.current.flyTo(
      [selectedWaste.latitude, selectedWaste.longitude],
      14,
      { duration: 0.8 }
    );
  }, [selectedWaste]);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-100 rounded-3xl overflow-hidden border border-border-chiseled shadow-inner">
      {/* Container DOM Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px] z-10" />

      {/* Kontrol Layer Basemap Switcher (Pojok Kanan Atas) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-level-2 border border-slate-200">
        <button
          onClick={() => switchBasemap('osm')}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeBasemap === 'osm'
              ? 'bg-[#00236F] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Peta Jalan Terbuka OpenStreetMap"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Jalan</span>
        </button>
        <button
          onClick={() => switchBasemap('satellite')}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeBasemap === 'satellite'
              ? 'bg-[#00236F] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Citra Satelit Esri Karst"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Satelit</span>
        </button>
        <button
          onClick={() => switchBasemap('topo')}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeBasemap === 'topo'
              ? 'bg-[#00236F] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Topografi Elevasi Kontur"
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>Kontur</span>
        </button>
        <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />
        <button
          onClick={handleFitBounds}
          className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#00236F]"
          title="Pusatkan ke seluruh titik"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Legenda Peta Floating (Pojok Kiri Atas) */}
      <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-3 rounded-2xl shadow-level-2 border border-slate-200 text-xs space-y-2 pointer-events-auto max-w-[220px]">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <p className="font-black text-[#00236F] text-[11px] uppercase tracking-wider">
            Legenda Spasial
          </p>
          <span className="text-[10px] text-slate-400 font-mono">Tulungagung</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#10B981] border-2 border-white shadow-sm flex items-center justify-center text-white shrink-0">
            <Droplets className="w-3 h-3 text-white" />
          </span>
          <span className="text-slate-700 font-semibold text-[11px] leading-tight">
            Sludge Lumpur (Kalsium)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#F59E0B] border-2 border-white shadow-sm flex items-center justify-center text-white shrink-0">
            <Boxes className="w-3 h-3 text-white" />
          </span>
          <span className="text-slate-700 font-semibold text-[11px] leading-tight">
            Afur Kasar (Pecahan Batu)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#8B5CF6] border-2 border-white shadow-sm flex items-center justify-center text-white shrink-0">
            <Building2 className="w-3 h-3 text-white" />
          </span>
          <span className="text-slate-700 font-semibold text-[11px] leading-tight">
            Pabrik Pemanfaat Offtaker
          </span>
        </div>
      </div>
    </div>
  );
}
