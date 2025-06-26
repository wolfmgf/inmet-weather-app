/**
 * @fileoverview Componente avançado para busca de cidades brasileiras
 * Inclui autocompletar, geolocalização e integração com mapa
 * @author Equipe de Desenvolvimento
 * @version 2.0.0
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import ClientOnly from '@/components/ClientOnly';
import {
  getTodosMunicipios,
  buscarMunicipios,
  encontrarMunicipioMaisProximo
} from '@/lib/inmet.service';
import { INMETMunicipio } from '@/types/inmet.types';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Componente avançado de formulário para busca de cidades brasileiras
 * Inclui autocompletar, geolocalização e navegação para previsão
 * 
 * @component
 * @example
 * ```tsx
 * <CitySearchForm />
 * ```
 */
export default function CitySearchForm() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<INMETMunicipio[]>([]);
  const [allMunicipios, setAllMunicipios] = useState<INMETMunicipio[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingMunicipios, setIsLoadingMunicipios] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const {
    latitude,
    longitude,
    error: locationError,
    loading: locationLoading,
    getCurrentLocation,
    isSupported: isGeolocationSupported,
  } = useGeolocation();

  // Carrega lista de municípios na inicialização
  useEffect(() => {
    const carregarMunicipios = async () => {
      setIsLoadingMunicipios(true);
      try {
        const municipios = await getTodosMunicipios();
        setAllMunicipios(municipios);
      } catch (error) {
        console.error('Erro ao carregar municípios:', error);
      } finally {
        setIsLoadingMunicipios(false);
      }
    };

    carregarMunicipios();
  }, []);

  // Atualiza sugestões quando o texto muda
  useEffect(() => {
    if (city.length >= 2 && allMunicipios.length > 0) {
      const resultados = buscarMunicipios(city, allMunicipios);
      setSuggestions(resultados);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [city, allMunicipios]);

  // Busca cidade mais próxima quando obtém geolocalização
  useEffect(() => {
    if (latitude && longitude && allMunicipios.length > 0) {
      const cidadeMaisProxima = encontrarMunicipioMaisProximo(
        latitude,
        longitude,
        allMunicipios
      );

      if (cidadeMaisProxima) {
        setCity(cidadeMaisProxima.nome);
        setShowSuggestions(false);
        // Navega automaticamente para a cidade encontrada
        router.push(`/previsao?cidade=${encodeURIComponent(cidadeMaisProxima.nome)}`);
      }
    }
  }, [latitude, longitude, allMunicipios, router]);

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      setShowSuggestions(false);
      router.push(`/previsao?cidade=${encodeURIComponent(city.trim())}`);
    }
  };

  /**
   * Manipula a seleção de uma sugestão
   */
  const handleSuggestionClick = (municipio: INMETMunicipio) => {
    setCity(municipio.nome);
    setShowSuggestions(false);
    router.push(`/previsao?cidade=${encodeURIComponent(municipio.nome)}`);
  };

  /**
   * Manipula navegação por teclado
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (city.trim()) {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  /**
   * Obtém localização atual do usuário
   */
  const handleGetLocation = () => {
    getCurrentLocation();
  };

  /**
   * Limpa o campo de busca
   */
  const handleClear = () => {
    setCity('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-lg relative">
      {/* Formulário principal */}
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 mb-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Digite o nome de um município brasileiro..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => city.length >= 2 && setShowSuggestions(true)}
            className="text-lg p-6 pr-10"
            disabled={isLoadingMunicipios}
          />

          {/* Botão de limpar */}
          {city && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button type="submit" size="lg" className="p-6" disabled={!city.trim()}>
          <Search className="h-6 w-6" />
        </Button>
      </form>

      {/* Botão de geolocalização */}
      <ClientOnly>
        {isGeolocationSupported && (
          <div className="flex justify-center mb-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="flex items-center gap-2"
            >
              {locationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              {locationLoading ? 'Obtendo localização...' : 'Usar minha localização'}
            </Button>
          </div>
        )}
      </ClientOnly>

      {/* Erro de geolocalização */}
      {locationError && (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      {/* Lista de sugestões */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <ul className="py-1">
            {suggestions.map((municipio, index) => (
              <li
                key={municipio.geocode}
                ref={el => { suggestionRefs.current[index] = el; }}
                onClick={() => handleSuggestionClick(municipio)}
                className={`px-4 py-2 cursor-pointer flex justify-between items-center ${index === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <span className="font-medium">{municipio.nome}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{municipio.sigla}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Indicador de carregamento */}
      {isLoadingMunicipios && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando municípios...
        </div>
      )}
    </div>
  );
}