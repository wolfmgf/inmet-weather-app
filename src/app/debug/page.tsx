/**
 * @fileoverview Página de debug para visualizar municípios disponíveis
 * Útil para desenvolvimento e verificação de dados da API do INMET
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

// app/debug/page.tsx
import { getTodosMunicipios } from '@/lib/inmet.service';

// Força geração dinâmica para sempre buscar dados atualizados
export const dynamic = 'force-dynamic';

/**
 * Página de debug para visualizar municípios disponíveis
 * Exibe lista dos primeiros 20 municípios com links para previsão
 * 
 * @component
 * @returns Página de debug com lista de municípios
 */
export default async function DebugPage() {
  const municipios = await getTodosMunicipios();

  // Pega apenas os primeiros 20 municípios para mostrar
  const primeirosMunicipios = municipios.slice(0, 20);

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Debug - Municípios Disponíveis</h1>

      <div className="mb-4">
        <p className="text-lg">Total de municípios: {municipios.length}</p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Primeiros 20 municípios:</h2>
        {primeirosMunicipios.map((municipio) => (
          <div key={municipio.geocode} className="border p-4 rounded">
            <h3 className="font-bold">{municipio.nome} - {municipio.sigla}</h3>
            <p>Geocode: {municipio.geocode}</p>
            <p>Coordenadas: {municipio.latitude}, {municipio.longitude}</p>
            <a
              href={`/previsao?cidade=${encodeURIComponent(municipio.nome)}`}
              className="text-blue-500 hover:underline"
            >
              Ver previsão
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
