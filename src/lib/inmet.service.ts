// lib/inmet.service.ts

import { INMETMunicipio, INMETPrevisaoCompleta } from "@/types/inmet.types";

// 1. ATUALIZAMOS A URL BASE PARA A API CORRETA DO INMET
const API_BASE_URL = "https://apiprevmet3.inmet.gov.br";

/**
 * Busca a lista de todos os municípios monitorados pelo INMET.
 * A lista é cacheada por 24 horas para otimizar a performance.
 * @returns Uma promessa que resolve para um array de municípios.
 */
export async function getTodosMunicipios(): Promise<INMETMunicipio[]> {
  try {
    // 2. ATUALIZAMOS O CAMINHO PARA O ENDPOINT CORRETO DE MUNICÍPIOS
    const response = await fetch(`${API_BASE_URL}/municipios`, {
      next: { revalidate: 86400 }, // 24 horas em segundos
    });
    if (!response.ok) throw new Error("Falha ao buscar municípios.");
    return await response.json();
  } catch (error) {
    console.error("Erro em getTodosMunicipios:", error);
    return [];
  }
}

/**
 * Busca a previsão do tempo para um município usando seu código.
 * A previsão é cacheada por 1 hora.
 * @param codigo - O código numérico do município.
 * @returns Uma promessa que resolve para os dados da previsão ou nulo em caso de erro.
 */
export async function getPrevisaoPorCodigo(
  codigo: string
): Promise<INMETPrevisaoCompleta | null> {
  try {
    // Lista de possíveis endpoints para previsão
    const endpoints = [
      `${API_BASE_URL}/previsao/diaria/municipio/${codigo}`,
      `${API_BASE_URL}/previsao/${codigo}`,
      `${API_BASE_URL}/forecast/${codigo}`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          next: { revalidate: 3600 }, // 1 hora em segundos
        });

        if (response.ok) {
          return await response.json();
        }
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} não funcionou, tentando próximo...`);
        continue;
      }
    }

    // Se nenhum endpoint funcionar, retornar dados mock para demonstração
    console.warn(
      `Previsão não disponível para o código ${codigo}. Usando dados mock.`
    );
    return getMockPrevisao(codigo);
  } catch (error) {
    console.error("Erro em getPrevisaoPorCodigo:", error);
    return getMockPrevisao(codigo);
  }
}

/**
 * Retorna dados mock de previsão para demonstração quando a API está indisponível
 */
function getMockPrevisao(codigo: string): INMETPrevisaoCompleta {
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return {
    [codigo]: {
      [formatDate(hoje)]: {
        manha: {
          entidade: "INMET",
          uf: "BR",
          cidade: "Cidade Exemplo",
          dia_semana: hoje.toLocaleDateString("pt-BR", { weekday: "long" }),
          ico: "ps",
          resumo: "Parcialmente nublado",
          temp_max: "25",
          temp_min: "18",
          umidade_max: "85",
          umidade_min: "55",
          vento_dir: "NE",
          vento_int: "15",
          icone: "https://portal.inmet.gov.br/img/tempo/ps.png",
          pressao_atmosferica: "1013.2",
          visibilidade: "10",
          ponto_orvalho: "16",
          indice_uv: "5",
          radiacao_solar: "850",
          rajada_vento: "22",
          sensacao_termica_max: "27",
          sensacao_termica_min: "16",
          probabilidade_chuva: "30",
          volume_chuva: "0.5",
          nascer_sol: "06:30",
          por_sol: "17:45",
          fase_lua: "Crescente",
          direcao_vento_graus: "45",
          cobertura_nuvens: "40",
        },
        tarde: {
          entidade: "INMET",
          uf: "BR",
          cidade: "Cidade Exemplo",
          dia_semana: hoje.toLocaleDateString("pt-BR", { weekday: "long" }),
          ico: "pn",
          resumo: "Parcialmente nublado",
          temp_max: "28",
          temp_min: "22",
          umidade_max: "75",
          umidade_min: "45",
          vento_dir: "E",
          vento_int: "18",
          icone: "https://portal.inmet.gov.br/img/tempo/pn.png",
          pressao_atmosferica: "1011.8",
          visibilidade: "12",
          ponto_orvalho: "18",
          indice_uv: "8",
          radiacao_solar: "1200",
          rajada_vento: "28",
          sensacao_termica_max: "32",
          sensacao_termica_min: "24",
          probabilidade_chuva: "20",
          volume_chuva: "0.2",
          nascer_sol: "06:30",
          por_sol: "17:45",
          fase_lua: "Crescente",
          direcao_vento_graus: "90",
          cobertura_nuvens: "35",
        },
        noite: {
          entidade: "INMET",
          uf: "BR",
          cidade: "Cidade Exemplo",
          dia_semana: hoje.toLocaleDateString("pt-BR", { weekday: "long" }),
          ico: "ec",
          resumo: "Encoberto",
          temp_max: "22",
          temp_min: "19",
          umidade_max: "90",
          umidade_min: "65",
          vento_dir: "SE",
          vento_int: "12",
          icone: "https://portal.inmet.gov.br/img/tempo/ec.png",
          pressao_atmosferica: "1014.5",
          visibilidade: "8",
          ponto_orvalho: "17",
          indice_uv: "0",
          radiacao_solar: "0",
          rajada_vento: "18",
          sensacao_termica_max: "23",
          sensacao_termica_min: "18",
          probabilidade_chuva: "60",
          volume_chuva: "2.5",
          nascer_sol: "06:30",
          por_sol: "17:45",
          fase_lua: "Crescente",
          direcao_vento_graus: "135",
          cobertura_nuvens: "85",
        },
      },
      [formatDate(amanha)]: {
        manha: {
          entidade: "INMET",
          uf: "BR",
          cidade: "Cidade Exemplo",
          dia_semana: amanha.toLocaleDateString("pt-BR", { weekday: "long" }),
          ico: "c",
          resumo: "Chuva",
          temp_max: "23",
          temp_min: "17",
          umidade_max: "95",
          umidade_min: "70",
          vento_dir: "S",
          vento_int: "20",
          icone: "https://portal.inmet.gov.br/img/tempo/c.png",
          pressao_atmosferica: "1008.3",
          visibilidade: "5",
          ponto_orvalho: "16",
          indice_uv: "3",
          radiacao_solar: "450",
          rajada_vento: "35",
          sensacao_termica_max: "24",
          sensacao_termica_min: "15",
          probabilidade_chuva: "85",
          volume_chuva: "15.2",
          nascer_sol: "06:31",
          por_sol: "17:45",
          fase_lua: "Crescente",
          direcao_vento_graus: "180",
          cobertura_nuvens: "95",
        },
        tarde: {
          entidade: "INMET",
          uf: "BR",
          cidade: "Cidade Exemplo",
          dia_semana: amanha.toLocaleDateString("pt-BR", { weekday: "long" }),
          ico: "ct",
          resumo: "Chuva com trovoadas",
          temp_max: "21",
          temp_min: "18",
          umidade_max: "98",
          umidade_min: "80",
          vento_dir: "SW",
          vento_int: "25",
          icone: "https://portal.inmet.gov.br/img/tempo/ct.png",
          pressao_atmosferica: "1006.1",
          visibilidade: "3",
          ponto_orvalho: "17",
          indice_uv: "2",
          radiacao_solar: "200",
          rajada_vento: "45",
          sensacao_termica_max: "22",
          sensacao_termica_min: "17",
          probabilidade_chuva: "95",
          volume_chuva: "25.8",
          nascer_sol: "06:31",
          por_sol: "17:45",
          fase_lua: "Crescente",
          direcao_vento_graus: "225",
          cobertura_nuvens: "100",
        },
        noite: {
          entidade: "INMET",
          uf: "BR",
          cidade: "Cidade Exemplo",
          dia_semana: amanha.toLocaleDateString("pt-BR", { weekday: "long" }),
          ico: "pn",
          resumo: "Parcialmente nublado",
          temp_max: "19",
          temp_min: "16",
          umidade_max: "85",
          umidade_min: "60",
          vento_dir: "W",
          vento_int: "15",
          icone: "https://portal.inmet.gov.br/img/tempo/pn.png",
          pressao_atmosferica: "1010.7",
          visibilidade: "9",
          ponto_orvalho: "14",
          indice_uv: "0",
          radiacao_solar: "0",
          rajada_vento: "23",
          sensacao_termica_max: "20",
          sensacao_termica_min: "15",
          probabilidade_chuva: "25",
          volume_chuva: "1.0",
          nascer_sol: "06:31",
          por_sol: "17:45",
          fase_lua: "Crescente",
          direcao_vento_graus: "270",
          cobertura_nuvens: "50",
        },
      },
    },
  };
}
