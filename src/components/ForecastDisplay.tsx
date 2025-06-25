// components/ForecastDisplay.tsx
'use client';

import { INMETPrevisaoCompleta, INMETPeriodo, INMETMunicipio } from '@/types/inmet.types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Thermometer, Wind, Droplets, Sunrise, Sun, Sunset } from 'lucide-react';
import Image from 'next/image';

// Sub-componente para exibir todos os dados de um período (manhã, tarde ou noite)
const PeriodoCard = ({ periodo, nomePeriodo }: { periodo: INMETPeriodo; nomePeriodo: string }) => {
  const PeriodoIcon = nomePeriodo === 'Manhã' ? Sunrise : nomePeriodo === 'Tarde' ? Sun : Sunset;

  return (
    <div className="flex-1 min-w-[300px] bg-slate-50/50 dark:bg-slate-900/50 border p-4 rounded-lg space-y-4">
      <div className="flex items-center gap-3">
        <PeriodoIcon className="h-7 w-7 text-primary" />
        <h4 className="text-xl font-bold">{nomePeriodo}</h4>
      </div>

      <div className="flex items-center gap-4">
        <Image src={periodo.icone} alt={periodo.resumo} width={100} height={100} unoptimized />
        <p className="text-muted-foreground flex-1">{periodo.resumo}</p>
      </div>

      <div className="space-y-3 text-base">
        <div className="flex items-center justify-between">
          <span className="font-semibold flex items-center gap-2"><Thermometer size={20} /> Temperatura</span>
          <span>{periodo.temp_min}°C - {periodo.temp_max}°C</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold flex items-center gap-2"><Droplets size={20} /> Umidade</span>
          <span>{periodo.umidade_min}% - {periodo.umidade_max}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold flex items-center gap-2"><Wind size={20} /> Vento</span>
          <span>{periodo.vento_int} ({periodo.vento_dir})</span>
        </div>
      </div>
    </div>
  );
};

// Componente principal que organiza a exibição por dia
export default function ForecastDisplay({ previsao, cidade }: { previsao: INMETPrevisaoCompleta; cidade: INMETMunicipio }) {
  const dadosDaCidade = previsao[cidade.ID];
  // Pega apenas os dois primeiros dias para uma UI mais limpa
  const diasDisponiveis = Object.keys(dadosDaCidade).slice(0, 2);

  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-3xl font-bold text-center">
        Previsão para {cidade.NOME} - {cidade.UF}
      </h2>
      {diasDisponiveis.map(diaKey => {
        const previsaoDoDia = dadosDaCidade[diaKey];
        return (
          <Card key={diaKey} className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl capitalize">{previsaoDoDia.manha.dia_semana}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row flex-wrap gap-4">
              <PeriodoCard periodo={previsaoDoDia.manha} nomePeriodo="Manhã" />
              <PeriodoCard periodo={previsaoDoDia.tarde} nomePeriodo="Tarde" />
              <PeriodoCard periodo={previsaoDoDia.noite} nomePeriodo="Noite" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}