/**
 * @fileoverview Componente de seleção de região e estado brasileiro
 * Permite navegar por estados e selecionar municípios
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, ChevronRight } from 'lucide-react';
import { getTodosMunicipios } from '@/lib/inmet.service';
import { INMETMunicipio } from '@/types/inmet.types';
import { useRouter } from 'next/navigation';

// Estados brasileiros agrupados por região
const REGIOES_BRASIL = {
  'Norte': ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
  'Nordeste': ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
  'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
  'Sudeste': ['ES', 'MG', 'RJ', 'SP'],
  'Sul': ['PR', 'RS', 'SC']
};

const NOMES_ESTADOS = {
  'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
  'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
  'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
  'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
  'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
};

/**
 * Componente de seleção de região/estado/município
 */
export default function RegionSelector() {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [allMunicipios, setAllMunicipios] = useState<INMETMunicipio[]>([]);
  const [filteredMunicipios, setFilteredMunicipios] = useState<INMETMunicipio[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Carrega municípios na inicialização
  useEffect(() => {
    const carregarMunicipios = async () => {
      setIsLoading(true);
      try {
        const municipios = await getTodosMunicipios();
        setAllMunicipios(municipios);
      } catch (error) {
        console.error('Erro ao carregar municípios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarMunicipios();
  }, []);

  // Filtra municípios quando estado é selecionado
  useEffect(() => {
    if (selectedState && allMunicipios.length > 0) {
      const municipiosDoEstado = allMunicipios
        .filter(municipio => municipio.sigla === selectedState)
        .sort((a, b) => a.nome.localeCompare(b.nome));
      setFilteredMunicipios(municipiosDoEstado);
    } else {
      setFilteredMunicipios([]);
    }
    setSelectedCity('');
  }, [selectedState, allMunicipios]);

  /**
   * Manipula seleção de região
   */
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setSelectedState('');
    setSelectedCity('');
  };

  /**
   * Manipula seleção de estado
   */
  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setSelectedCity('');
  };

  /**
   * Manipula seleção de cidade
   */
  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
  };

  /**
   * Navega para a previsão da cidade selecionada
   */
  const handleViewForecast = () => {
    if (selectedCity) {
      router.push(`/previsao?cidade=${encodeURIComponent(selectedCity)}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
          <MapPin className="h-5 w-5" />
          Selecione por Região
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Navegue pelas regiões, estados e municípios do Brasil
        </p>
      </div>

      {/* Grid de regiões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.keys(REGIOES_BRASIL).map((regiao) => (
          <Button
            key={regiao}
            variant={selectedRegion === regiao ? "default" : "outline"}
            onClick={() => handleRegionSelect(regiao)}
            className="h-12 flex items-center justify-between"
          >
            <span>{regiao}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Seletor de estado */}
      {selectedRegion && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Estado ({selectedRegion})</label>
          <Select value={selectedState} onValueChange={handleStateSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um estado" />
            </SelectTrigger>
            <SelectContent>
              {REGIOES_BRASIL[selectedRegion as keyof typeof REGIOES_BRASIL].map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {NOMES_ESTADOS[estado as keyof typeof NOMES_ESTADOS]} ({estado})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Seletor de município */}
      {selectedState && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Município ({NOMES_ESTADOS[selectedState as keyof typeof NOMES_ESTADOS]})
          </label>
          <Select value={selectedCity} onValueChange={handleCitySelect} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isLoading
                    ? "Carregando municípios..."
                    : filteredMunicipios.length > 0
                      ? "Selecione um município"
                      : "Nenhum município encontrado"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filteredMunicipios.map((municipio) => (
                <SelectItem key={municipio.geocode} value={municipio.nome}>
                  {municipio.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Botão para ver previsão */}
      {selectedCity && (
        <div className="pt-4">
          <Button
            onClick={handleViewForecast}
            className="w-full"
            size="lg"
          >
            Ver Previsão para {selectedCity}
          </Button>
        </div>
      )}

      {/* Informações do estado selecionado */}
      {selectedState && filteredMunicipios.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>{filteredMunicipios.length}</strong> municípios disponíveis em{' '}
            <strong>{NOMES_ESTADOS[selectedState as keyof typeof NOMES_ESTADOS]}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
