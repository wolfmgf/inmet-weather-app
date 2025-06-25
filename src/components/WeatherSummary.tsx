// components/WeatherSummary.tsx
'use client';

import { INMETPeriodo } from '@/types/inmet.types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Sun,
  Gauge,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

interface WeatherSummaryProps {
  periodo: INMETPeriodo;
  nomePeriodo: string;
}

export default function WeatherSummary({ periodo, nomePeriodo }: WeatherSummaryProps) {
  // Debug detalhado para WeatherSummary
  console.log(`[WEATHER SUMMARY ${nomePeriodo}] - Propriedades de vento:`, {
    vento_int: periodo.vento_int,
    vento_dir: periodo.vento_dir,
    tipo_vento_int: typeof periodo.vento_int,
    tipo_vento_dir: typeof periodo.vento_dir,
    periodoCompleto: JSON.stringify(periodo, null, 2)
  });

  const getUVLevel = (uv: string) => {
    const uvIndex = parseInt(uv);
    if (uvIndex <= 2) return { level: 'Baixo', color: 'text-green-600', bg: 'bg-green-100' };
    if (uvIndex <= 5) return { level: 'Moderado', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (uvIndex <= 7) return { level: 'Alto', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (uvIndex <= 10) return { level: 'Muito Alto', color: 'text-red-600', bg: 'bg-red-100' };
    return { level: 'Extremo', color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const uvInfo = periodo.indice_uv ? getUVLevel(periodo.indice_uv) : null;

  return (
    <Card className="mb-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Ícone e condições principais */}
          <div className="flex items-center gap-4">
            <Image
              src={periodo.icone}
              alt={periodo.resumo}
              width={120}
              height={120}
              unoptimized
              className="drop-shadow-lg"
            />
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {nomePeriodo}
              </h3>
              <p className="text-xl text-blue-700 dark:text-blue-200 font-medium">
                {periodo.resumo}
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                {periodo.temp_min}°C - {periodo.temp_max}°C
              </p>
              {periodo.sensacao_termica_max && periodo.sensacao_termica_min && (
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Sensação: {periodo.sensacao_termica_min}°C - {periodo.sensacao_termica_max}°C
                </p>
              )}
            </div>
          </div>

          {/* Métricas principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            <div className="text-center p-3 bg-white/70 dark:bg-slate-800/70 rounded-lg">
              <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Umidade</p>
              <p className="font-semibold">{periodo.umidade_min}%-{periodo.umidade_max}%</p>
            </div>

            <div className="text-center p-3 bg-white/70 dark:bg-slate-800/70 rounded-lg">
              <Wind className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Vento</p>
              <p className="font-semibold">
                {periodo.vento_int ? `${periodo.vento_int} km/h` : 'N/A'} {periodo.vento_dir || ''}
              </p>
            </div>

            {periodo.pressao_atmosferica && (
              <div className="text-center p-3 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                <Gauge className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Pressão</p>
                <p className="font-semibold">{periodo.pressao_atmosferica} hPa</p>
              </div>
            )}

            {periodo.visibilidade && (
              <div className="text-center p-3 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                <Eye className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Visibilidade</p>
                <p className="font-semibold">{periodo.visibilidade} km</p>
              </div>
            )}
          </div>

          {/* Alertas importantes */}
          <div className="space-y-2">
            {uvInfo && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${uvInfo.bg}`}>
                <Sun className={`h-5 w-5 ${uvInfo.color}`} />
                <div>
                  <p className="text-xs font-medium">Índice UV</p>
                  <p className={`font-semibold ${uvInfo.color}`}>
                    {periodo.indice_uv} - {uvInfo.level}
                  </p>
                </div>
              </div>
            )}

            {periodo.probabilidade_chuva && parseInt(periodo.probabilidade_chuva) > 50 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs font-medium">Chuva</p>
                  <p className="font-semibold text-blue-600">
                    {periodo.probabilidade_chuva}% chance
                  </p>
                </div>
              </div>
            )}

            {periodo.rajada_vento && parseInt(periodo.rajada_vento) > 40 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Wind className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-xs font-medium">Rajadas</p>
                  <p className="font-semibold text-orange-600">
                    {periodo.rajada_vento} km/h
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
