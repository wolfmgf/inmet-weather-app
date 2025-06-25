// types/inmet.types.ts

// Representa um município na lista do INMET
export interface INMETMunicipio {
  ID: string;
  NOME: string;
  UF: string;
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
