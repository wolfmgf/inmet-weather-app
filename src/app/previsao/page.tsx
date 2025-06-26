/**
 * @fileoverview Página de exibição de previsão do tempo para municípios
 * Busca dados da API do INMET e exibe previsão completa
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

// app/previsao/page.tsx
import { getTodosMunicipios, getPrevisaoPorCodigo } from '@/lib/inmet.service';
import CitySearchForm from '@/components/CitySearchForm';
import ForecastDisplay from '@/components/ForecastDisplay'; // Criaremos a seguir
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { INMETMunicipio, INMETPrevisaoCompleta } from '@/types/inmet.types';

// Força geração dinâmica para sempre buscar dados atualizados
export const dynamic = 'force-dynamic';

/** Props da página de previsão */
interface PrevisaoPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * Normaliza string removendo acentos e convertendo para minúsculas
 * Usado para comparação de nomes de cidades
 * 
 * @param str - String para normalizar
 * @returns String normalizada sem acentos em minúsculas
 */
const normalizeString = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/**
 * Página de previsão do tempo
 * Busca dados do INMET com base no parâmetro 'cidade' da URL
 * 
 * @component
 * @param searchParams - Parâmetros de busca da URL
 * @returns Página com previsão do tempo ou mensagens de erro
 */
export default async function PrevisaoPage({ searchParams }: PrevisaoPageProps) {
  const codeParam = typeof searchParams.codigo === 'string' ? searchParams.codigo : undefined;
  const cityParam = typeof searchParams.cidade === 'string' ? searchParams.cidade : undefined;
  let previsao: INMETPrevisaoCompleta | null = null;
  let cidadeEncontrada: INMETMunicipio | null = null;
  let error = '';

  const municipios = await getTodosMunicipios();
  if (municipios.length === 0) {
    error = "O serviço de meteorologia parece estar offline. Tente novamente mais tarde.";
  } else if (codeParam) {
    // Busca por código de município
    cidadeEncontrada = municipios.find(m => m.geocode.toString() === codeParam) || null;
    if (cidadeEncontrada) {
      previsao = await getPrevisaoPorCodigo(codeParam);
    } else {
      error = `Município com código ${codeParam} não encontrado.`;
    }
  } else if (cityParam) {
    // Busca por nome de cidade
    cidadeEncontrada = municipios.find(m => normalizeString(m.nome) === normalizeString(cityParam)) || null;
    if (cidadeEncontrada) {
      previsao = await getPrevisaoPorCodigo(cidadeEncontrada.geocode.toString());
      console.log('[DEBUG PREVISAO PAGE] - Dados recebidos da API:', JSON.stringify(previsao, null, 2));
      if (previsao) {
        // Verificar estrutura dos dados especificamente para vento
        const primeirosDados = Object.values(previsao)[0];
        if (primeirosDados) {
          const primeiroDia = Object.values(primeirosDados)[0];
          if (primeiroDia) {
            console.log('[DEBUG PREVISAO PAGE] - Dados manhã:', {
              vento_int: primeiroDia.manha.vento_int,
              vento_dir: primeiroDia.manha.vento_dir,
              keys: Object.keys(primeiroDia.manha)
            });
          }
        }
      } else {
        error = "A previsão para esta cidade não está disponível no momento.";
      }
    } else {
      error = `O município "${cityParam}" não foi encontrado. Por favor, verifique a ortografia.`;
    }
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="my-8 flex flex-col items-center">
        <a href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400 mb-6">
          Previsão do Tempo INMET
        </a>
        <CitySearchForm />
      </header>

      {error && (
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ocorreu um Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {cidadeEncontrada && previsao ? (
        <ForecastDisplay previsao={previsao} cidade={cidadeEncontrada} />
      ) : !error && (
        <p className="text-center text-muted-foreground">Faça uma busca para ver a previsão do tempo.</p>
      )}
    </main>
  );
}