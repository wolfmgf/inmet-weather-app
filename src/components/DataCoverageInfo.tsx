// components/DataCoverageInfo.tsx
'use client';

import { INMETPeriodo } from '@/types/inmet.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface DataCoverageInfoProps {
  periodo: INMETPeriodo;
  showDetails?: boolean;
}

export default function DataCoverageInfo({ periodo, showDetails = false }: DataCoverageInfoProps) {
  // Lista de todos os campos possíveis da interface INMETPeriodo
  const allFields = [
    { key: 'entidade', label: 'Entidade', required: true },
    { key: 'uf', label: 'UF', required: true },
    { key: 'cidade', label: 'Cidade', required: true },
    { key: 'dia_semana', label: 'Dia da Semana', required: true },
    { key: 'ico', label: 'Ícone (ico)', required: false },
    { key: 'resumo', label: 'Resumo', required: true },
    { key: 'temp_max', label: 'Temperatura Máxima', required: true },
    { key: 'temp_min', label: 'Temperatura Mínima', required: true },
    { key: 'umidade_max', label: 'Umidade Máxima', required: true },
    { key: 'umidade_min', label: 'Umidade Mínima', required: true },
    { key: 'vento_dir', label: 'Direção do Vento', required: true },
    { key: 'vento_int', label: 'Intensidade do Vento', required: true },
    { key: 'icone', label: 'Ícone (icone)', required: true },
    { key: 'pressao_atmosferica', label: 'Pressão Atmosférica', required: false },
    { key: 'visibilidade', label: 'Visibilidade', required: false },
    { key: 'ponto_orvalho', label: 'Ponto de Orvalho', required: false },
    { key: 'indice_uv', label: 'Índice UV', required: false },
    { key: 'radiacao_solar', label: 'Radiação Solar', required: false },
    { key: 'rajada_vento', label: 'Rajada de Vento', required: false },
    { key: 'sensacao_termica_max', label: 'Sensação Térmica Máx', required: false },
    { key: 'sensacao_termica_min', label: 'Sensação Térmica Mín', required: false },
    { key: 'probabilidade_chuva', label: 'Probabilidade de Chuva', required: false },
    { key: 'volume_chuva', label: 'Volume de Chuva', required: false },
    { key: 'nascer_sol', label: 'Nascer do Sol', required: false },
    { key: 'por_sol', label: 'Pôr do Sol', required: false },
    { key: 'fase_lua', label: 'Fase da Lua', required: false },
    { key: 'direcao_vento_graus', label: 'Direção Vento (graus)', required: false },
    { key: 'cobertura_nuvens', label: 'Cobertura de Nuvens', required: false }
  ];

  // Verificar quais campos têm dados
  const fieldsWithData = allFields.filter(field => {
    const value = (periodo as any)[field.key];
    return value !== undefined && value !== null && value !== '' && value !== '0';
  });

  const fieldsWithoutData = allFields.filter(field => {
    const value = (periodo as any)[field.key];
    return value === undefined || value === null || value === '' || value === '0';
  });

  const requiredFields = allFields.filter(f => f.required);
  const optionalFields = allFields.filter(f => !f.required);

  const requiredFieldsWithData = fieldsWithData.filter(f => f.required);
  const optionalFieldsWithData = fieldsWithData.filter(f => !f.required);

  const coveragePercentage = Math.round((fieldsWithData.length / allFields.length) * 100);

  if (!showDetails) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Info size={16} className="text-blue-500" />
        <span>
          Cobertura de dados: {fieldsWithData.length}/{allFields.length} campos ({coveragePercentage}%)
        </span>
      </div>
    );
  }

  return (
    <Card className="mt-4 bg-slate-50 dark:bg-slate-800/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Info size={20} className="text-blue-500" />
          Cobertura de Dados - {coveragePercentage}%
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campos obrigatórios */}
          <div>
            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
              Campos Obrigatórios ({requiredFieldsWithData.length}/{requiredFields.length})
            </h4>
            <div className="space-y-1">
              {requiredFields.map(field => {
                const hasData = fieldsWithData.some(f => f.key === field.key);
                return (
                  <div key={field.key} className="flex items-center gap-2 text-sm">
                    {hasData ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <XCircle size={14} className="text-red-500" />
                    )}
                    <span className={hasData ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                      {field.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Campos opcionais */}
          <div>
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Campos Opcionais ({optionalFieldsWithData.length}/{optionalFields.length})
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {optionalFields.map(field => {
                const hasData = fieldsWithData.some(f => f.key === field.key);
                return (
                  <div key={field.key} className="flex items-center gap-2 text-sm">
                    {hasData ? (
                      <CheckCircle size={14} className="text-blue-500" />
                    ) : (
                      <XCircle size={14} className="text-gray-400" />
                    )}
                    <span className={hasData ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}>
                      {field.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-2">
          <p>ℹ️ Esta aplicação exibe TODOS os dados disponibilizados pela API do INMET.</p>
          <p>Alguns campos opcionais podem não estar disponíveis para todas as localidades ou períodos.</p>
        </div>
      </CardContent>
    </Card>
  );
}
