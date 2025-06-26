/**
 * @fileoverview Serviço para integração com a API oficial do INMET
 *
 * Este arquivo contém todas as funções responsáveis por buscar dados
 * meteorológicos da API oficial do Instituto Nacional de Meteorologia (INMET).
 *
 * Funcionalidades principais:
 * - Busca de lista de municípios brasileiros
 * - Obtenção de previsões meteorológicas detalhadas
 * - Sistema de cache inteligente
 * - Fallbacks para alta disponibilidade
 * - Dados mock para desenvolvimento/emergência
 *
 * @author Sistema de Previsão INMET
 * @version 1.0.0
 */

import { INMETMunicipio, INMETPrevisaoCompleta } from "@/types/inmet.types";

// ========== CONFIGURAÇÕES DA API ==========

/**
 * URL base da API oficial do INMET para previsões meteorológicas
 * @constant {string}
 */
const API_BASE_URL = "https://apiprevmet3.inmet.gov.br";

/**
 * Tempo de cache para lista de municípios (24 horas em segundos)
 * @constant {number}
 */
const MUNICIPIOS_CACHE_TIME = 86400;

/**
 * Tempo de cache para previsões (1 hora em segundos)
 * @constant {number}
 */
const PREVISAO_CACHE_TIME = 3600;

// ========== FUNÇÕES PRINCIPAIS ==========

/**
 * Busca a lista completa de municípios monitorados pelo INMET
 *
 * @description Esta função obtém todos os municípios brasileiros que possuem
 * estações meteorológicas ou são cobertos pelas previsões do INMET.
 * Os dados são automaticamente cacheados por 24 horas para otimizar performance.
 *
 * @returns {Promise<INMETMunicipio[]>} Array de municípios com seus códigos e coordenadas
 *
 * @example
 * ```typescript
 * const municipios = await getTodosMunicipios();
 * console.log(`Encontrados ${municipios.length} municípios`);
 * ```
 *
 * @throws Em caso de erro, retorna array vazio e loga o erro no console
 */
export async function getTodosMunicipios(): Promise<INMETMunicipio[]> {
  try {
    console.log("🏙️ [INMET] Buscando lista de municípios...");

    const response = await fetch(`${API_BASE_URL}/municipios`, {
      next: { revalidate: MUNICIPIOS_CACHE_TIME },
      headers: {
        Accept: "application/json",
        "User-Agent": "INMET-Weather-App/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const municipios = await response.json();
    console.log(`✅ [INMET] ${municipios.length} municípios obtidos`);
    console.log("� [INMET] Dados dos municípios:");
    console.log(JSON.stringify(municipios, null, 2));

    return municipios;
  } catch (error) {
    console.error("❌ [INMET] Erro ao buscar municípios:", error);
    return getMunicipiosMock();
  }
}

/**
 * Busca a previsão meteorológica detalhada para um município específico
 *
 * @description Tenta obter dados de previsão utilizando múltiplos endpoints
 * do INMET em ordem de prioridade. Se todos falharem, utiliza dados mock.
 * As previsões são cacheadas por 1 hora para eficiência.
 *
 * @param {string} codigo - Código do município (geocode) como string
 *
 * @returns {Promise<INMETPrevisaoCompleta | null>} Dados completos da previsão
 * ou null se todos os métodos falharem
 *
 * @example
 * ```typescript
 * const previsao = await getPrevisaoPorCodigo("3550308"); // São Paulo
 * if (previsao) {
 *   console.log("Previsão obtida com sucesso");
 * }
 * ```
 */
export async function getPrevisaoPorCodigo(
  codigo: string
): Promise<INMETPrevisaoCompleta | null> {
  try {
    console.log(`🌤️ [INMET] Buscando previsão para município: ${codigo}`);

    // Lista de endpoints ordenados por prioridade/estabilidade
    const endpoints = [
      `${API_BASE_URL}/previsao/diaria/municipio/${codigo}`,
      `${API_BASE_URL}/previsao/${codigo}`,
      `${API_BASE_URL}/forecast/${codigo}`,
    ];

    // Tenta cada endpoint em sequência
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];

      try {
        console.log(
          `📡 [INMET] Tentativa ${i + 1}/${endpoints.length}: ${endpoint}`
        );

        const response = await fetch(endpoint, {
          next: { revalidate: PREVISAO_CACHE_TIME },
          headers: {
            Accept: "application/json",
            "User-Agent": "INMET-Weather-App/1.0",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(
            `✅ [INMET] Dados obtidos com sucesso do endpoint ${i + 1}`
          );
          console.log("📋 [INMET] Dados da previsão:");
          console.log(JSON.stringify(data, null, 2));

          // Normaliza campos de índice UV e velocidade do vento
          Object.keys(data).forEach((codigoCidade) => {
            const dias = data[codigoCidade];
            Object.keys(dias).forEach((dia) => {
              const previsaoDia = dias[dia];
              (["manha", "tarde", "noite"] as const).forEach((periodoKey) => {
                const periodo = previsaoDia[periodoKey];
                // UV alternativo
                if ((periodo as any).uv && !periodo.indice_uv) {
                  periodo.indice_uv = (periodo as any).uv;
                }
                // Velocidade do vento alternativa
                if ((periodo as any).wind_speed && !periodo.vento_int) {
                  periodo.vento_int = (periodo as any).wind_speed;
                }
                if ((periodo as any).velocidade_vento && !periodo.vento_int) {
                  periodo.vento_int = (periodo as any).velocidade_vento;
                }
              });
            });
          });

          return data;
        } else {
          console.log(
            `⚠️ [INMET] Endpoint ${i + 1} falhou - Status: ${response.status}`
          );
        }
      } catch (endpointError) {
        console.log(`❌ [INMET] Erro no endpoint ${i + 1}:`, endpointError);
        continue;
      }
    }

    // Se nenhum endpoint funcionar, utilizar dados mock
    console.log("⚠️ [INMET] Todos os endpoints falharam, usando dados mock");
    return getMockPrevisao(codigo);
  } catch (error) {
    console.error("❌ [INMET] Erro na busca de previsão:", error);
    return getMockPrevisao(codigo);
  }
}

// ========== FUNÇÕES DE FALLBACK E DADOS MOCK ==========

/**
 * Retorna dados mock de municípios para desenvolvimento e fallback de emergência
 *
 * @description Esta função fornece uma lista básica de municípios brasileiros
 * para uso quando a API oficial está indisponível ou durante desenvolvimento.
 *
 * @returns {INMETMunicipio[]} Array com municípios principais do Brasil
 *
 * @private
 */
function getMunicipiosMock(): INMETMunicipio[] {
  console.log("🏙️ [INMET] Gerando dados mock de municípios");

  const municipiosMock = [
    {
      geocode: 3550308,
      nome: "São Paulo",
      sigla: "SP",
      longitude: "-46.6333",
      latitude: "-23.5500",
    },
    {
      geocode: 3304557,
      nome: "Rio de Janeiro",
      sigla: "RJ",
      longitude: "-43.1729",
      latitude: "-22.9068",
    },
    {
      geocode: 3106200,
      nome: "Belo Horizonte",
      sigla: "MG",
      longitude: "-43.9378",
      latitude: "-19.9208",
    },
    {
      geocode: 5300108,
      nome: "Brasília",
      sigla: "DF",
      longitude: "-47.8825",
      latitude: "-15.7942",
    },
    {
      geocode: 4106902,
      nome: "Curitiba",
      sigla: "PR",
      longitude: "-49.2731",
      latitude: "-25.4284",
    },
    {
      geocode: 4314902,
      nome: "Porto Alegre",
      sigla: "RS",
      longitude: "-51.2302",
      latitude: "-30.0346",
    },
    {
      geocode: 2304400,
      nome: "Fortaleza",
      sigla: "CE",
      longitude: "-38.5434",
      latitude: "-3.7172",
    },
    {
      geocode: 2927408,
      nome: "Salvador",
      sigla: "BA",
      longitude: "-38.5014",
      latitude: "-12.9714",
    },
    {
      geocode: 2611606,
      nome: "Recife",
      sigla: "PE",
      longitude: "-34.8805",
      latitude: "-8.0476",
    },
    {
      geocode: 1302603,
      nome: "Manaus",
      sigla: "AM",
      longitude: "-60.0212",
      latitude: "-3.1190",
    },
  ];

  console.log(
    `[Mock Service] ✅ ${municipiosMock.length} municípios mock gerados`
  );
  console.log("[Mock Service] 🗺️  Municípios incluídos:");
  municipiosMock.forEach((municipio, index) => {
    console.log(
      `  ${index + 1}. ${municipio.nome}/${municipio.sigla} (${
        municipio.geocode
      })`
    );
  });

  const estadosUnicos = Array.from(new Set(municipiosMock.map((m) => m.sigla)));
  console.log(
    `[Mock Service] 📍 Estados cobertos: ${estadosUnicos.join(", ")}`
  );
  console.log("=".repeat(60));

  return municipiosMock;
}

/**
 * Gera dados mock de previsão meteorológica para fallback
 *
 * @description Cria dados de previsão realistas para desenvolvimento
 * e situações de emergência quando a API está indisponível.
 * Os dados incluem todos os campos possíveis da interface INMETPeriodo.
 *
 * @param {string} codigo - Código do município para o qual gerar dados mock
 *
 * @returns {INMETPrevisaoCompleta} Objeto com previsão para hoje e amanhã
 *
 * @private
 */
function getMockPrevisao(codigo: string): INMETPrevisaoCompleta {
  console.log(`🎭 [INMET] Gerando dados mock para código: ${codigo}`);

  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const gerarDadosPeriodo = (data: Date, periodo: string) => {
    const configs = {
      manha: {
        ico: "ps",
        resumo: "Parcialmente nublado",
        temp_max: "25",
        temp_min: "18",
        uv: "5",
        radiacao: "850",
      },
      tarde: {
        ico: "pn",
        resumo: "Parcialmente nublado",
        temp_max: "28",
        temp_min: "22",
        uv: "8",
        radiacao: "1200",
      },
      noite: {
        ico: "ec",
        resumo: "Encoberto",
        temp_max: "22",
        temp_min: "19",
        uv: "0",
        radiacao: "0",
      },
    };

    const config = configs[periodo as keyof typeof configs];

    const dadosPeriodo = {
      entidade: "INMET",
      uf: "BR",
      cidade: "Cidade Exemplo",
      dia_semana: data.toLocaleDateString("pt-BR", { weekday: "long" }),
      ico: config.ico,
      resumo: config.resumo,
      temp_max: config.temp_max,
      temp_min: config.temp_min,
      umidade_max: "85",
      umidade_min: "55",
      vento_dir: "NE",
      vento_int: "15",
      icone: `https://portal.inmet.gov.br/img/tempo/${config.ico}.png`,

      // Dados meteorológicos completos
      pressao_atmosferica: "1013.2",
      visibilidade: "10",
      ponto_orvalho: "16",
      indice_uv: config.uv,
      radiacao_solar: config.radiacao,
      rajada_vento: "22",
      sensacao_termica_max: (parseInt(config.temp_max) + 2).toString(),
      sensacao_termica_min: (parseInt(config.temp_min) - 2).toString(),
      probabilidade_chuva: "30",
      volume_chuva: "0.5",
      nascer_sol: "06:30",
      por_sol: "17:45",
      fase_lua: "Crescente",
      direcao_vento_graus: "45",
      cobertura_nuvens: "40",
    };

    console.log(
      `[Mock Service] 🕐 Período ${periodo} - ${
        Object.keys(dadosPeriodo).length
      } campos gerados`
    );
    return dadosPeriodo;
  };

  const mockData = {
    [codigo]: {
      [formatDate(hoje)]: {
        manha: gerarDadosPeriodo(hoje, "manha"),
        tarde: gerarDadosPeriodo(hoje, "tarde"),
        noite: gerarDadosPeriodo(hoje, "noite"),
      },
      [formatDate(amanha)]: {
        manha: gerarDadosPeriodo(amanha, "manha"),
        tarde: gerarDadosPeriodo(amanha, "tarde"),
        noite: gerarDadosPeriodo(amanha, "noite"),
      },
    },
  };

  console.log("📋 [INMET] Dados mock gerados:");
  console.log(JSON.stringify(mockData, null, 2));

  return mockData;
}

// ========== FUNÇÕES AUXILIARES PÚBLICAS ==========

/**
 * Busca municípios com nome ou sigla similar ao termo fornecido
 */
export function buscarMunicipios(
  termo: string,
  municipios: INMETMunicipio[]
): INMETMunicipio[] {
  if (!termo || termo.length < 2) return municipios.slice(0, 50);

  const termoLower = termo.toLowerCase().trim();

  return municipios
    .filter(
      (municipio) =>
        municipio.nome.toLowerCase().includes(termoLower) ||
        municipio.sigla.toLowerCase().includes(termoLower)
    )
    .slice(0, 100);
}

/**
 * Valida se um código de município é válido
 */
export function validarCodigoMunicipio(
  codigo: string,
  municipios: INMETMunicipio[]
): boolean {
  if (!codigo || !/^\d+$/.test(codigo)) return false;

  return municipios.some(
    (municipio) => municipio.geocode.toString() === codigo
  );
}

/**
 * Obtém informações do município pelo código
 */
export function obterMunicipioPorCodigo(
  codigo: string,
  municipios: INMETMunicipio[]
): INMETMunicipio | null {
  return (
    municipios.find((municipio) => municipio.geocode.toString() === codigo) ||
    null
  );
}

/**
 * Encontra o município mais próximo baseado em coordenadas geográficas
 *
 * @param latitude - Latitude do ponto de referência
 * @param longitude - Longitude do ponto de referência
 * @param municipios - Lista de municípios para buscar
 * @returns Município mais próximo ou null se não encontrado
 */
export function encontrarMunicipioMaisProximo(
  latitude: number,
  longitude: number,
  municipios: INMETMunicipio[]
): INMETMunicipio | null {
  if (!municipios.length) return null;

  /**
   * Calcula a distância entre duas coordenadas usando a fórmula de Haversine
   *
   * @param lat1 - Latitude do primeiro ponto
   * @param lon1 - Longitude do primeiro ponto
   * @param lat2 - Latitude do segundo ponto
   * @param lon2 - Longitude do segundo ponto
   * @returns Distância em quilômetros
   */
  const calcularDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  let municipioMaisProximo = municipios[0];
  let menorDistancia = calcularDistancia(
    latitude,
    longitude,
    parseFloat(municipios[0].latitude),
    parseFloat(municipios[0].longitude)
  );

  for (const municipio of municipios) {
    const distancia = calcularDistancia(
      latitude,
      longitude,
      parseFloat(municipio.latitude),
      parseFloat(municipio.longitude)
    );

    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      municipioMaisProximo = municipio;
    }
  }

  console.log(
    `🎯 [INMET] Município mais próximo: ${municipioMaisProximo.nome}/${
      municipioMaisProximo.sigla
    } (${menorDistancia.toFixed(2)}km)`
  );

  return municipioMaisProximo;
}
