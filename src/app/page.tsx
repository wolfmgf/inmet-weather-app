/**
 * @fileoverview Página inicial da aplicação de previsão do tempo
 * Exibe formulário de busca, seletor de região e informações sobre as funcionalidades
 * @author Equipe de Desenvolvimento
 * @version 2.0.0
 */

// app/page.tsx
import CitySearchForm from '@/components/CitySearchForm';
import MapSelectorWrapper from '@/components/MapSelectorWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Sun,
  Gauge,
  CloudRain,
  Sunrise,
  MapPin,
  Search,
  Navigation
} from 'lucide-react';

/**
 * Página inicial da aplicação
 * Apresenta múltiplas formas de busca e demonstra as funcionalidades disponíveis
 * 
 * @component
 * @returns Página inicial com hero section, formulários de busca e grid de funcionalidades
 */
export default function HomePage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* Header Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-clip-text text-transparent mb-4">
          Previsão do Tempo INMET
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Dados meteorológicos oficiais do Instituto Nacional de Meteorologia
        </p>

        {/* Múltiplas formas de buscar cidades */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="busca" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="busca" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar Cidade
              </TabsTrigger>
              <TabsTrigger value="mapa" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Navegar no Mapa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="busca" className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
                  <Search className="h-5 w-5" />
                  Digite o nome da cidade
                </div>
                <CitySearchForm />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground max-w-2xl">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-blue-500" />
                    <span>Geolocalização automática</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-green-500" />
                    <span>Busca com autocompletar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span>Navegação por teclado</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mapa" className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  Navegue pelo Brasil
                </div>
                <MapSelectorWrapper />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Thermometer className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <CardTitle>Temperatura Completa</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Temperatura máxima, mínima e sensação térmica para cada período do dia</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Wind className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <CardTitle>Informações de Vento</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Velocidade, direção e rajadas máximas do vento em tempo real</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Droplets className="h-12 w-12 text-cyan-500 mx-auto mb-2" />
            <CardTitle>Umidade e Chuva</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Umidade relativa, probabilidade de chuva e volume esperado</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Sun className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <CardTitle>Índice UV</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Níveis de radiação ultravioleta para proteção solar adequada</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Gauge className="h-12 w-12 text-purple-500 mx-auto mb-2" />
            <CardTitle>Pressão Atmosférica</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Medições de pressão barométrica para análise meteorológica</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Eye className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <CardTitle>Visibilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Distância de visibilidade e cobertura de nuvens</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sunrise className="h-6 w-6 text-orange-500" />
              Informações Astronômicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Horários do nascer e pôr do sol</li>
              <li>• Fases da lua</li>
              <li>• Radiação solar</li>
              <li>• Ponto de orvalho</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-green-500" />
              Cobertura Nacional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Todos os municípios brasileiros</li>
              <li>• Dados oficiais do INMET</li>
              <li>• Previsão para manhã, tarde e noite</li>
              <li>• Atualização automática</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white mb-8">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Como usar</h2>
          <p className="text-lg">
            Digite o nome de qualquer município brasileiro no campo de busca acima
            para obter informações meteorológicas detalhadas e previsão do tempo completa.
          </p>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Sun className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Dados da API</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize os dados brutos retornados pela API do INMET
                </p>
              </div>
            </div>
            <div className="text-center">
              <a
                href="/dados-api"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
              >
                Ver Dados da API
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Debug & Logs</h3>
                <p className="text-sm text-muted-foreground">
                  Página para desenvolvedores testarem a API
                </p>
              </div>
            </div>
            <div className="text-center">
              <a
                href="/debug"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
              >
                Acessar Debug
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}