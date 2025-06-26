'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Carrega o MapSelector apenas no cliente para evitar problemas de SSR
const MapSelectorComponent = dynamic(() => import('./MapSelector'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
      <p>Carregando mapa...</p>
    </div>
  )
});

export default function MapSelectorWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
        <p>Preparando mapa...</p>
      </div>
    );
  }

  return <MapSelectorComponent />;
}
