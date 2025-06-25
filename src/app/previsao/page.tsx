// app/previsao/page.tsx
import { getTodosMunicipios, getPrevisaoPorCodigo } from '@/lib/inmet.service';
import CitySearchForm from '@/components/CitySearchForm';
import ForecastDisplay from '@/components/ForecastDisplay'; // Criaremos a seguir
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { INMETMunicipio, INMETPrevisaoCompleta } from '@/types/inmet.types';

export const dynamic = 'force-dynamic';

interface PrevisaoPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const normalizeString = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default async function PrevisaoPage({ searchParams }: PrevisaoPageProps) {
  const cityQuery = typeof searchParams.cidade === 'string' ? searchParams.cidade : '';
  let previsao: INMETPrevisaoCompleta | null = null;
  let cidadeEncontrada: INMETMunicipio | null = null;
  let error = '';

  if (cityQuery) {
    const municipios = await getTodosMunicipios();
    if (municipios.length > 0) {
      cidadeEncontrada = municipios.find(m => normalizeString(m.NOME) === normalizeString(cityQuery)) || null;

      if (cidadeEncontrada) {
        previsao = await getPrevisaoPorCodigo(cidadeEncontrada.ID);
        if (!previsao) {
          error = "A previsão para esta cidade não está disponível no momento.";
        }
      } else {
        error = `O município "${cityQuery}" não foi encontrado. Por favor, verifique a ortografia.`;
      }
    } else {
      error = "O serviço de meteorologia parece estar offline. Tente novamente mais tarde.";
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