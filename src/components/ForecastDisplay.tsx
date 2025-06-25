// components/ForecastDisplay.tsx
'use client';

import { INMETPrevisaoCompleta, INMETPeriodo, INMETMunicipio } from '@/types/inmet.types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import WeatherSummary from './WeatherSummary';
import DataCoverageInfo from './DataCoverageInfo';
import {
  Thermometer,
  Wind,
  Droplets,
  Sunrise,
  Sun,
  Sunset,
  Eye,
  Gauge,
  Zap,
  CloudRain,
  Compass,
  Cloud,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

// Sub-componente para exibir informações meteorológicas detalhadas
const DetailedWeatherInfo = ({ periodo }: { periodo: INMETPeriodo }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {/* Pressão Atmosférica */}
      {periodo.pressao_atmosferica && (
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <Gauge size={18} className="text-blue-600" />
            Pressão
          </span>
          <span className="font-semibold">{periodo.pressao_atmosferica} hPa</span>
        </div>
      )}

      {/* Visibilidade */}
      {periodo.visibilidade && (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <Eye size={18} className="text-green-600" />
            Visibilidade
          </span>
          <span className="font-semibold">{periodo.visibilidade} km</span>
        </div>
      )}

      {/* Índice UV */}
      {periodo.indice_uv && (
        <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <Sun size={18} className="text-yellow-600" />
            Índice UV
          </span>
          <span className="font-semibold">{periodo.indice_uv}</span>
        </div>
      )}

      {/* Ponto de Orvalho */}
      {periodo.ponto_orvalho && (
        <div className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <Droplets size={18} className="text-cyan-600" />
            Ponto de Orvalho
          </span>
          <span className="font-semibold">{periodo.ponto_orvalho}°C</span>
        </div>
      )}

      {/* Probabilidade de Chuva */}
      {periodo.probabilidade_chuva && (
        <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <CloudRain size={18} className="text-indigo-600" />
            Prob. Chuva
          </span>
          <span className="font-semibold">{periodo.probabilidade_chuva}%</span>
        </div>
      )}

      {/* Volume de Chuva */}
      {periodo.volume_chuva && periodo.volume_chuva !== "0" && (
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <CloudRain size={18} className="text-slate-600" />
            Volume Chuva
          </span>
          <span className="font-semibold">{periodo.volume_chuva} mm</span>
        </div>
      )}

      {/* Rajada de Vento */}
      {periodo.rajada_vento && (
        <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <Wind size={18} className="text-orange-600" />
            Rajada Vento
          </span>
          <span className="font-semibold">{periodo.rajada_vento} km/h</span>
        </div>
      )}

      {/* Sensação Térmica Máxima */}
      {periodo.sensacao_termica_max && (
        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <Thermometer size={18} className="text-red-600" />
            Sensação Máx
          </span>
          <span className="font-semibold">{periodo.sensacao_termica_max}°C</span>
        </div>
      )}

      {/* Sensação Térmica Mínima */}
      {periodo.sensacao_termica_min && (
        <div className="flex items-center justify-between p-3 bg-red-100 dark:bg-red-800/20 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <Thermometer size={18} className="text-red-500" />
            Sensação Mín
          </span>
          <span className="font-semibold">{periodo.sensacao_termica_min}°C</span>
        </div>
      )}

      {/* Cobertura de Nuvens */}
      {periodo.cobertura_nuvens && (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <Cloud size={18} className="text-gray-600" />
            Nuvens
          </span>
          <span className="font-semibold">{periodo.cobertura_nuvens}%</span>
        </div>
      )}

      {/* Radiação Solar */}
      {periodo.radiacao_solar && periodo.radiacao_solar !== "0" && (
        <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <Zap size={18} className="text-amber-600" />
            Radiação Solar
          </span>
          <span className="font-semibold">{periodo.radiacao_solar} W/m²</span>
        </div>
      )}

      {/* Direção do Vento em Graus */}
      {periodo.direcao_vento_graus && (
        <div className="flex items-center justify-between p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
          <span className="font-medium flex items-center gap-2">
            <Compass size={18} className="text-violet-600" />
            Direção Vento
          </span>
          <span className="font-semibold">{periodo.direcao_vento_graus}° ({periodo.vento_dir})</span>
        </div>
      )}
    </div>
  );
};

// Sub-componente para exibir informações astronômicas
const AstroInfo = ({ periodo }: { periodo: INMETPeriodo }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
      {periodo.nascer_sol && (
        <div className="flex items-center gap-3">
          <Sunrise size={20} className="text-orange-500" />
          <div>
            <p className="text-sm font-medium">Nascer do Sol</p>
            <p className="font-semibold">{periodo.nascer_sol}</p>
          </div>
        </div>
      )}

      {periodo.por_sol && (
        <div className="flex items-center gap-3">
          <Sunset size={20} className="text-orange-600" />
          <div>
            <p className="text-sm font-medium">Pôr do Sol</p>
            <p className="font-semibold">{periodo.por_sol}</p>
          </div>
        </div>
      )}

      {periodo.fase_lua && (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-yellow-200 border border-yellow-300"></div>
          <div>
            <p className="text-sm font-medium">Fase da Lua</p>
            <p className="font-semibold">{periodo.fase_lua}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-componente para exibir todos os dados de um período (manhã, tarde ou noite)
const PeriodoCard = ({ periodo, nomePeriodo }: { periodo: INMETPeriodo; nomePeriodo: string }) => {
  const PeriodoIcon = nomePeriodo === 'Manhã' ? Sunrise : nomePeriodo === 'Tarde' ? Sun : Sunset;

  // Debug completo do objeto periodo
  console.log(`[DEBUG ${nomePeriodo}] - Objeto completo:`, JSON.stringify(periodo, null, 2));
  console.log(`[DEBUG ${nomePeriodo}] - Campos de ícone:`, {
    ico: periodo.ico,
    icone: periodo.icone,
    tem_ico: !!periodo.ico,
    tem_icone: !!periodo.icone,
    ico_diferente_icone: periodo.ico !== periodo.icone
  });
  console.log(`[DEBUG ${nomePeriodo}] - Informações básicas:`, {
    cidade: periodo.cidade,
    dia_semana: periodo.dia_semana,
    entidade: periodo.entidade,
    uf: periodo.uf
  });

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <PeriodoIcon className="h-7 w-7 text-primary" />
        <h4 className="text-xl font-bold">{nomePeriodo}</h4>
      </div>

      <div className="flex items-center gap-4">
        <Image src={periodo.icone} alt={periodo.resumo} width={80} height={80} unoptimized />
        <div className="flex-1">
          <p className="text-lg font-medium">{periodo.resumo}</p>
          <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Temp.</p>
              <p className="font-semibold">{periodo.temp_min}°C - {periodo.temp_max}°C</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Umidade</p>
              <p className="font-semibold">{periodo.umidade_min}% - {periodo.umidade_max}%</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Vento</p>
              <p className="font-semibold">
                {periodo.vento_int ? `${periodo.vento_int} km/h` : 'N/A'} {periodo.vento_dir || ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informações detalhadas */}
      <DetailedWeatherInfo periodo={periodo} />

      {/* Debug de campos não utilizados ou diferentes */}
      {(periodo.ico && periodo.ico !== periodo.icone) && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            🔍 Campo ICO detectado (diferente de ICONE): {periodo.ico}
          </p>
        </div>
      )}

      {/* Exibir outros campos não convencionais que possam estar presentes */}
      {Object.keys(periodo).filter(key => {
        // Lista de campos conhecidos que já estão sendo exibidos
        const knownFields = [
          'entidade', 'uf', 'cidade', 'dia_semana', 'ico', 'resumo',
          'temp_max', 'temp_min', 'umidade_max', 'umidade_min',
          'vento_dir', 'vento_int', 'icone', 'pressao_atmosferica',
          'visibilidade', 'ponto_orvalho', 'indice_uv', 'radiacao_solar',
          'rajada_vento', 'sensacao_termica_max', 'sensacao_termica_min',
          'probabilidade_chuva', 'volume_chuva', 'nascer_sol', 'por_sol',
          'fase_lua', 'direcao_vento_graus', 'cobertura_nuvens'
        ];
        return !knownFields.includes(key) && (periodo as any)[key];
      }).length > 0 && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
              🔍 Campos adicionais detectados na API:
            </p>
            <div className="text-xs space-y-1">
              {Object.keys(periodo).filter(key => {
                const knownFields = [
                  'entidade', 'uf', 'cidade', 'dia_semana', 'ico', 'resumo',
                  'temp_max', 'temp_min', 'umidade_max', 'umidade_min',
                  'vento_dir', 'vento_int', 'icone', 'pressao_atmosferica',
                  'visibilidade', 'ponto_orvalho', 'indice_uv', 'radiacao_solar',
                  'rajada_vento', 'sensacao_termica_max', 'sensacao_termica_min',
                  'probabilidade_chuva', 'volume_chuva', 'nascer_sol', 'por_sol',
                  'fase_lua', 'direcao_vento_graus', 'cobertura_nuvens'
                ];
                return !knownFields.includes(key) && (periodo as any)[key];
              }).map(key => (
                <div key={key} className="bg-purple-100 dark:bg-purple-800/30 p-2 rounded">
                  <strong>{key}:</strong> {JSON.stringify((periodo as any)[key])}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Informações astronômicas (apenas para manhã) */}
      {nomePeriodo === 'Manhã' && <AstroInfo periodo={periodo} />}
    </div>
  );
};

// Componente principal que organiza a exibição por dia
export default function ForecastDisplay({ previsao, cidade }: { previsao: INMETPrevisaoCompleta; cidade: INMETMunicipio }) {
  const dadosDaCidade = previsao[cidade.geocode.toString()];

  // Verifica se há dados disponíveis
  if (!dadosDaCidade) {
    return (
      <div className="text-center mt-8">
        <p className="text-lg text-gray-600">Dados de previsão não disponíveis para esta cidade.</p>
      </div>
    );
  }

  // Pega apenas os dois primeiros dias para uma UI mais limpa
  const diasDisponiveis = Object.keys(dadosDaCidade).slice(0, 2);

  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
        Previsão para {cidade.nome} - {cidade.sigla}
      </h2>

      {/* Resumo das condições atuais */}
      {diasDisponiveis.length > 0 && (
        <WeatherSummary
          periodo={dadosDaCidade[diasDisponiveis[0]].manha}
          nomePeriodo="Condições Atuais - Manhã"
        />
      )}

      {diasDisponiveis.map((diaKey, index) => {
        const previsaoDoDia = dadosDaCidade[diaKey];

        // Função para formatar a data corretamente
        const formatarData = (dataString: string, index: number) => {
          try {
            // Se a data está no formato YYYY-MM-DD
            if (dataString.includes('-')) {
              const [ano, mes, dia] = dataString.split('-');
              if (ano && mes && dia) {
                const data = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));

                // Verifica se a data é válida
                if (!isNaN(data.getTime())) {
                  return data.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                }
              }
            }

            // Fallback: usar o dia da semana dos dados
            return previsaoDoDia.manha.dia_semana;
          } catch (error) {
            // Se houver erro, usar o dia da semana dos dados
            return previsaoDoDia.manha.dia_semana;
          }
        };

        const dataFormatada = formatarData(diaKey, index);

        return (
          <Card key={diaKey} className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl capitalize text-center">
                {index === 0 ? 'Hoje' : 'Amanhã'} - {dataFormatada}
              </CardTitle>
              <CardDescription className="text-center text-slate-200">
                {previsaoDoDia.manha.cidade && previsaoDoDia.manha.cidade !== cidade.nome ?
                  `${previsaoDoDia.manha.cidade} - ` : ''
                }Dados oficiais - {previsaoDoDia.manha.entidade} | {previsaoDoDia.manha.uf}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PeriodoCard periodo={previsaoDoDia.manha} nomePeriodo="Manhã" />
                <PeriodoCard periodo={previsaoDoDia.tarde} nomePeriodo="Tarde" />
                <PeriodoCard periodo={previsaoDoDia.noite} nomePeriodo="Noite" />
              </div>

              {/* Informações de cobertura de dados para o primeiro dia */}
              {index === 0 && (
                <div className="mt-6">
                  <DataCoverageInfo periodo={previsaoDoDia.manha} showDetails={true} />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Legenda de informações */}
      <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle size={20} className="text-blue-600" />
            Informações Meteorológicas Detalhadas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Fonte de Dados:</strong> Instituto Nacional de Meteorologia (INMET) - Dados oficiais do governo brasileiro</p>
          <p><strong>Pressão Atmosférica:</strong> Medida em hectopascais (hPa). Valores normais ficam entre 1000-1020 hPa.</p>
          <p><strong>Índice UV:</strong> 0-2 (Baixo), 3-5 (Moderado), 6-7 (Alto), 8-10 (Muito Alto), 11+ (Extremo)</p>
          <p><strong>Ponto de Orvalho:</strong> Temperatura na qual o ar fica saturado de umidade.</p>
          <p><strong>Visibilidade:</strong> Distância máxima que se pode enxergar claramente.</p>
          <p><strong>Sensação Térmica:</strong> Como a temperatura é percebida pelo corpo humano.</p>
          <p><strong>Radiação Solar:</strong> Energia solar incidente medida em Watts por metro quadrado (W/m²).</p>
          <p><strong>Direção do Vento:</strong> Apresentada em graus (0-360°) e direção cardeal (N, S, L, O, etc.).</p>
        </CardContent>
      </Card>

      {/* Informações sobre cobertura completa dos dados */}
      <Card className="mt-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            ✅ Cobertura Completa dos Dados INMET
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>Esta aplicação exibe <strong>TODAS</strong> as informações meteorológicas disponibilizadas pela API oficial do INMET:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
            <span>✅ Pressão Atmosférica</span>
            <span>✅ Visibilidade</span>
            <span>✅ Ponto de Orvalho</span>
            <span>✅ Índice UV</span>
            <span>✅ Radiação Solar</span>
            <span>✅ Rajada de Vento</span>
            <span>✅ Sensação Térmica Máx</span>
            <span>✅ Sensação Térmica Mín</span>
            <span>✅ Probabilidade de Chuva</span>
            <span>✅ Volume de Chuva</span>
            <span>✅ Nascer do Sol</span>
            <span>✅ Pôr do Sol</span>
            <span>✅ Fase da Lua</span>
            <span>✅ Direção Vento (graus)</span>
            <span>✅ Cobertura de Nuvens</span>
            <span>✅ Temperatura (min/max)</span>
            <span>✅ Umidade (min/max)</span>
            <span>✅ Vento (intensidade/direção)</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            * Alguns dados podem não estar disponíveis para todas as localidades ou períodos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}