// app/page.tsx
import CitySearchForm from '@/components/CitySearchForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Sun,
  Gauge,
  CloudRain,
  Sunrise,
  MapPin
} from 'lucide-react';

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
        <CitySearchForm />
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
      <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Como usar</h2>
          <p className="text-lg">
            Digite o nome de qualquer município brasileiro no campo de busca acima
            para obter informações meteorológicas detalhadas e previsão do tempo completa.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}