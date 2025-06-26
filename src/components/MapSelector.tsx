'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent, LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { INMETMunicipio } from '@/types/inmet.types';
import { getTodosMunicipios, encontrarMunicipioMaisProximo } from '@/lib/inmet.service';
import { useRouter } from 'next/navigation';

// Corrigir ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente interno para capturar cliques no mapa e selecionar localização
function LocationMarker({ municipios }: { municipios: INMETMunicipio[] }) {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<INMETMunicipio | null>(null);
  const markerRef = useRef<any>(null);
  const router = useRouter();

  useMapEvents({
    click(e: LeafletMouseEvent) {
      console.log('🗺️ Clique no mapa:', { lat: e.latlng.lat, lng: e.latlng.lng });
      console.log('🏙️ Total de municípios disponíveis:', municipios.length);

      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      if (municipios.length > 0) {
        const nearest = encontrarMunicipioMaisProximo(lat, lng, municipios);
        console.log('📍 Município mais próximo encontrado:', nearest);
        setSelectedMunicipio(nearest);
      } else {
        console.warn('⚠️ Nenhum município carregado ainda');
      }
    }
  });

  useEffect(() => {
    console.log('🔄 LocationMarker useEffect:', { position, selectedMunicipio });
    if (markerRef.current && position && selectedMunicipio) {
      setTimeout(() => {
        markerRef.current?.openPopup();
      }, 100);
    }
  }, [position, selectedMunicipio]);

  console.log('🎯 Renderizando marker:', { position, selectedMunicipio });

  return position && selectedMunicipio ? (
    <Marker ref={markerRef} position={position}>
      <Popup>
        <div className="p-2 space-y-1">
          <p><strong>Cidade:</strong> {selectedMunicipio.nome}</p>
          <p><strong>UF:</strong> {selectedMunicipio.sigla}</p>
          <button
            onClick={() => router.push(`/previsao?codigo=${selectedMunicipio.geocode}`)}
            className="text-blue-600 underline block mt-2"
          >
            Ver Previsão
          </button>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

export default function MapSelector() {
  const [municipios, setMunicipios] = useState<INMETMunicipio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 Carregando municípios...');
    getTodosMunicipios()
      .then((list) => {
        console.log('✅ Municípios carregados:', list.length);
        setMunicipios(list);
      })
      .catch((error) => {
        console.error('❌ Erro ao carregar municípios:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p>Carregando mapa...</p>
      </div>
    );
  }

  if (municipios.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <p>Erro ao carregar municípios. Tente recarregar a página.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-sm text-gray-600 mb-2">
        Clique em qualquer local do mapa para encontrar a cidade mais próxima
      </p>
      {/* @ts-ignore: react-leaflet types */}
      <MapContainer
        center={[-14.2350, -51.9253]} // Centro aproximado do Brasil
        zoom={4}
        style={{ height: '400px', width: '100%' }}
      >
        {/* @ts-ignore: react-leaflet types */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker municipios={municipios} />
      </MapContainer>
    </div>
  );
}
