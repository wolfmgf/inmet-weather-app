// types/inmet.types.ts

// Representa um município na lista do INMET
export interface INMETMunicipio {
  geocode: number;
  nome: string;
  sigla: string;
  longitude: string;
  latitude: string;
}

// Representa todos os dados disponíveis para um período do dia
export interface INMETPeriodo {
  entidade: string;
  uf: string;
  cidade: string;
  dia_semana: string;
  ico: string;
  resumo: string;
  temp_max: string;
  temp_min: string;
  umidade_max: string;
  umidade_min: string;
  vento_dir: string;
  vento_int: string;
  icone: string; // URL do ícone da previsão

  // Informações meteorológicas adicionais
  pressao_atmosferica?: string; // Pressão atmosférica em hPa
  visibilidade?: string; // Visibilidade em km
  ponto_orvalho?: string; // Ponto de orvalho em °C
  indice_uv?: string; // Índice UV
  radiacao_solar?: string; // Radiação solar em W/m²
  rajada_vento?: string; // Rajada máxima do vento em km/h
  sensacao_termica_max?: string; // Sensação térmica máxima em °C
  sensacao_termica_min?: string; // Sensação térmica mínima em °C
  probabilidade_chuva?: string; // Probabilidade de chuva em %
  volume_chuva?: string; // Volume esperado de chuva em mm
  nascer_sol?: string; // Horário do nascer do sol
  por_sol?: string; // Horário do pôr do sol
  fase_lua?: string; // Fase da lua
  direcao_vento_graus?: string; // Direção do vento em graus
  cobertura_nuvens?: string; // Cobertura de nuvens em %
}

// Representa a previsão para um dia completo, com seus 3 períodos
export interface INMETPrevisaoDia {
  manha: INMETPeriodo;
  tarde: INMETPeriodo;
  noite: INMETPeriodo;
}

// Representa a resposta completa da API de previsão, com chave dinâmica
export interface INMETPrevisaoCompleta {
  [codigoCidade: string]: {
    [dia: string]: INMETPrevisaoDia;
  };
}
