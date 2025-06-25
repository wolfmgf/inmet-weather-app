// lib/inmet.service.ts
import { INMETMunicipio, INMETPrevisaoCompleta } from "@/types/inmet.types";

const API_BASE_URL = "https://apiprevmet.inmet.gov.br";

/**
 * Busca a lista de todos os municípios monitorados pelo INMET.
 * A lista é cacheada por 24 horas para otimizar a performance.
 * @returns Uma promessa que resolve para um array de municípios.
 */
export async function getTodosMunicipios(): Promise<INMETMunicipio[]> {
  try {
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
export async function getPrevisaoPorCodigo(codigo: string): Promise<INMETPrevisaoCompleta | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/previsao/${codigo}`, {
      next: { revalidate: 3600 }, // 1 hora em segundos
    });
    if (!response.ok) throw new Error(`Falha ao buscar previsão para o código ${codigo}.`);
    return await response.json();
  } catch (error) {
    console.error("Erro em getPrevisaoPorCodigo:", error);
    return null;
  }
}