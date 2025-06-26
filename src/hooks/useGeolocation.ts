/**
 * @fileoverview Hook personalizado para geolocalização do usuário
 * Fornece funcionalidades para obter a localização atual do usuário
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

"use client";

import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

interface UseGeolocationReturn extends GeolocationState {
  getCurrentLocation: () => void;
  isSupported: boolean;
}

/**
 * Hook personalizado para geolocalização
 *
 * @returns Objeto com informações de localização e função para obter localização atual
 */
export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
  });

  const [isSupported, setIsSupported] = useState(false);

  // Verificar suporte apenas no cliente para evitar erro de hidratação
  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "navigator" in window &&
      "geolocation" in navigator;
    setIsSupported(supported);
  }, []);

  /**
   * Obtém a localização atual do usuário
   */
  const getCurrentLocation = () => {
    if (!isSupported) {
      setState((prev) => ({
        ...prev,
        error: "Geolocalização não é suportada neste navegador",
        loading: false,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutos
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = "Erro ao obter localização";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permissão negada para acessar localização";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Localização indisponível";
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo limite para obter localização";
            break;
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      options
    );
  };

  return {
    ...state,
    getCurrentLocation,
    isSupported,
  };
}
