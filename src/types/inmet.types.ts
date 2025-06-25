/**
 * @fileoverview Definições de tipos TypeScript para a API do INMET
 *
 * Este arquivo contém todas as interfaces e tipos utilizados para estruturar
 * os dados da API oficial do Instituto Nacional de Meteorologia (INMET).
 *
 * As interfaces foram projetadas para cobrir 100% dos dados disponibilizados
 * pela API, incluindo campos obrigatórios e opcionais.
 *
 * @author Sistema de Previsão INMET
 * @version 1.0.0
 */

/**
 * Interface que representa um município na lista oficial do INMET
 *
 * @interface INMETMunicipio
 * @description Cada município brasileiro monitorado pelo INMET possui
 * um geocode único e coordenadas geográficas para localização precisa.
 */
export interface INMETMunicipio {
  /** Código único do município no sistema INMET (chave primária) */
  geocode: number;

  /** Nome oficial do município */
  nome: string;

  /** Sigla da Unidade Federativa (estado) - ex: "SP", "RJ", "MG" */
  sigla: string;

  /** Coordenada de longitude em formato string decimal */
  longitude: string;

  /** Coordenada de latitude em formato string decimal */
  latitude: string;
}

/**
 * Interface que representa todos os dados meteorológicos disponíveis
 * para um período específico do dia (manhã, tarde ou noite)
 *
 * @interface INMETPeriodo
 * @description Contém campos obrigatórios (sempre presentes) e opcionais
 * (podem não estar disponíveis para todas as localidades/períodos).
 * Todos os valores numéricos são retornados como strings pela API.
 */
export interface INMETPeriodo {
  // ========== CAMPOS OBRIGATÓRIOS ==========

  /** Entidade responsável pelos dados meteorológicos - ex: "INMET" */
  entidade: string;

  /** Sigla da Unidade Federativa onde está o município */
  uf: string;

  /** Nome da cidade para qual são os dados */
  cidade: string;

  /** Dia da semana por extenso - ex: "Segunda-feira" */
  dia_semana: string;

  /** Código alfanumérico do ícone meteorológico - ex: "ps", "c", "ec" */
  ico: string;

  /** Resumo textual das condições meteorológicas - ex: "Sol entre nuvens" */
  resumo: string;

  /** Temperatura máxima prevista em Celsius (formato string) */
  temp_max: string;

  /** Temperatura mínima prevista em Celsius (formato string) */
  temp_min: string;

  /** Umidade relativa máxima em porcentagem (formato string) */
  umidade_max: string;

  /** Umidade relativa mínima em porcentagem (formato string) */
  umidade_min: string;

  /** Direção predominante do vento - ex: "Norte", "Sudeste", "Variável" */
  vento_dir: string;

  /** Intensidade/velocidade do vento em km/h (formato string) */
  vento_int: string;

  /** URL completa do ícone da previsão no portal do INMET */
  icone: string;

  // ========== CAMPOS OPCIONAIS ==========

  /**
   * Pressão atmosférica em hectopascais (hPa)
   * Valores normais: 1000-1020 hPa
   */
  pressao_atmosferica?: string;

  /**
   * Visibilidade atmosférica em quilômetros
   * Indica a distância máxima de visão clara
   */
  visibilidade?: string;

  /**
   * Ponto de orvalho em graus Celsius
   * Temperatura na qual o ar fica saturado de umidade
   */
  ponto_orvalho?: string;

  /**
   * Índice de radiação ultravioleta
   * Escala: 0-2 (Baixo), 3-5 (Moderado), 6-7 (Alto), 8-10 (Muito Alto), 11+ (Extremo)
   */
  indice_uv?: string;

  /**
   * Radiação solar em Watts por metro quadrado (W/m²)
   * Energia solar incidente na superfície
   */
  radiacao_solar?: string;

  /**
   * Rajada máxima do vento em km/h
   * Pico de velocidade do vento em período específico
   */
  rajada_vento?: string;

  /**
   * Sensação térmica máxima em graus Celsius
   * Como a temperatura máxima é percebida pelo corpo humano
   */
  sensacao_termica_max?: string;

  /**
   * Sensação térmica mínima em graus Celsius
   * Como a temperatura mínima é percebida pelo corpo humano
   */
  sensacao_termica_min?: string;

  /**
   * Probabilidade de precipitação em porcentagem
   * Chance de ocorrer chuva no período
   */
  probabilidade_chuva?: string;

  /**
   * Volume esperado de chuva em milímetros
   * Quantidade estimada de precipitação
   */
  volume_chuva?: string;

  /**
   * Horário do nascer do sol - ex: "06:30"
   * Disponível apenas para o período da manhã
   */
  nascer_sol?: string;

  /**
   * Horário do pôr do sol - ex: "18:45"
   * Disponível apenas para o período da manhã
   */
  por_sol?: string;

  /**
   * Fase atual da lua - ex: "Crescente", "Cheia", "Minguante"
   * Disponível apenas para o período da manhã
   */
  fase_lua?: string;

  /**
   * Direção do vento em graus (0-360°)
   * 0°/360° = Norte, 90° = Leste, 180° = Sul, 270° = Oeste
   */
  direcao_vento_graus?: string;

  /**
   * Cobertura de nuvens em porcentagem
   * 0% = céu limpo, 100% = completamente nublado
   */
  cobertura_nuvens?: string;
}

/**
 * Interface que representa a previsão meteorológica completa para um dia,
 * dividida nos três períodos padrão do INMET
 *
 * @interface INMETPrevisaoDia
 * @description Cada dia possui dados específicos para manhã, tarde e noite,
 * permitindo análise detalhada da variação das condições ao longo do dia.
 */
export interface INMETPrevisaoDia {
  /** Dados meteorológicos para o período da manhã (06:00-12:00) */
  manha: INMETPeriodo;

  /** Dados meteorológicos para o período da tarde (12:00-18:00) */
  tarde: INMETPeriodo;

  /** Dados meteorológicos para o período da noite (18:00-06:00) */
  noite: INMETPeriodo;
}

/**
 * Interface que representa a resposta completa da API de previsão do INMET
 *
 * @interface INMETPrevisaoCompleta
 * @description Estrutura aninhada que organiza os dados por código de cidade
 * e por data, permitindo acesso eficiente às previsões de múltiplos dias.
 *
 * @example
 * ```typescript
 * const previsao: INMETPrevisaoCompleta = {
 *   "3550308": {  // Código do município de São Paulo
 *     "2024-01-15": {
 *       manha: { ... },
 *       tarde: { ... },
 *       noite: { ... }
 *     },
 *     "2024-01-16": {
 *       manha: { ... },
 *       tarde: { ... },
 *       noite: { ... }
 *     }
 *   }
 * }
 * ```
 */
export interface INMETPrevisaoCompleta {
  /**
   * Mapeamento por código de cidade (geocode como string)
   * Cada entrada contém as previsões para múltiplos dias
   */
  [codigoCidade: string]: {
    /**
     * Mapeamento por data no formato "YYYY-MM-DD"
     * Cada entrada contém a previsão completa do dia (manhã, tarde, noite)
     */
    [dia: string]: INMETPrevisaoDia;
  };
}
