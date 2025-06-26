/**
 * @fileoverview Página de teste das funcionalidades implementadas
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getTodosMunicipios, encontrarMunicipioMaisProximo } from '@/lib/inmet.service';
import { INMETMunicipio } from '@/types/inmet.types';
import ClientOnly from '@/components/ClientOnly';

export default function TestPage() {
  const [municipios, setMunicipios] = useState<INMETMunicipio[]>([]);
  const [nearestCity, setNearestCity] = useState<INMETMunicipio | null>(null);
  const [loading, setLoading] = useState(false);
  const geolocation = useGeolocation();

  const testGetMunicipios = async () => {
    setLoading(true);
    try {
      const municipiosList = await getTodosMunicipios();
      setMunicipios(municipiosList.slice(0, 10)); // Apenas os primeiros 10 para teste
    } catch (error) {
      console.error('Erro ao buscar municípios:', error);
    } finally {
      setLoading(false);
    }
  };

  const testFindNearestCity = async () => {
    if (!geolocation.latitude || !geolocation.longitude) {
      alert('Primeiro obtenha sua localização!');
      return;
    }

    setLoading(true);
    try {
      // Primeiro precisamos buscar todos os municípios
      const todosMunicipios = await getTodosMunicipios();

      // Depois encontrar o mais próximo
      const nearest = encontrarMunicipioMaisProximo(
        geolocation.latitude,
        geolocation.longitude,
        todosMunicipios
      );
      setNearestCity(nearest);
    } catch (error) {
      console.error('Erro ao buscar cidade mais próxima:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Página de Teste das Funcionalidades</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teste de Geolocalização */}
        <Card>
          <CardHeader>
            <CardTitle>Teste de Geolocalização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ClientOnly fallback={<p>Carregando informações de geolocalização...</p>}>
              <div>
                <p><strong>Suportado:</strong> {geolocation.isSupported ? 'Sim' : 'Não'}</p>
                <p><strong>Carregando:</strong> {geolocation.loading ? 'Sim' : 'Não'}</p>
                <p><strong>Latitude:</strong> {geolocation.latitude || 'N/A'}</p>
                <p><strong>Longitude:</strong> {geolocation.longitude || 'N/A'}</p>
                <p><strong>Precisão:</strong> {geolocation.accuracy ? `${geolocation.accuracy}m` : 'N/A'}</p>
                {geolocation.error && (
                  <p className="text-red-500"><strong>Erro:</strong> {geolocation.error}</p>
                )}
              </div>
              <Button
                onClick={geolocation.getCurrentLocation}
                disabled={!geolocation.isSupported || geolocation.loading}
              >
                Obter Localização
              </Button>
            </ClientOnly>
          </CardContent>
        </Card>

        {/* Teste de Busca de Municípios */}
        <Card>
          <CardHeader>
            <CardTitle>Teste de Busca de Municípios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testGetMunicipios}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Buscar Municípios (10 primeiros)'}
            </Button>

            {municipios.length > 0 && (
              <div className="max-h-48 overflow-y-auto">
                <h4 className="font-semibold mb-2">Municípios encontrados:</h4>
                <ul className="text-sm space-y-1">
                  {municipios.map((municipio) => (
                    <li key={municipio.geocode} className="p-2 bg-gray-50 rounded">
                      {municipio.nome} - {municipio.sigla}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Teste de Cidade Mais Próxima */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Teste de Cidade Mais Próxima</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testFindNearestCity}
              disabled={loading || !geolocation.latitude || !geolocation.longitude}
            >
              {loading ? 'Buscando...' : 'Encontrar Cidade Mais Próxima'}
            </Button>

            {nearestCity && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">Cidade mais próxima:</h4>
                <p><strong>Nome:</strong> {nearestCity.nome}</p>
                <p><strong>UF:</strong> {nearestCity.sigla}</p>
                <p><strong>Geocode:</strong> {nearestCity.geocode}</p>
                <p><strong>Latitude:</strong> {nearestCity.latitude}</p>
                <p><strong>Longitude:</strong> {nearestCity.longitude}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button
          onClick={() => window.location.href = '/'}
          variant="outline"
        >
          Voltar para a página inicial
        </Button>
      </div>
    </main>
  );
}
