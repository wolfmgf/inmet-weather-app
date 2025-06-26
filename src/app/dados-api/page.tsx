"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPrevisaoPorCodigo } from "@/lib/inmet.service";
import { INMETPrevisaoCompleta } from "@/types/inmet.types";

export default function DadosApiPage() {
  const [codigoMunicipio, setCodigoMunicipio] = useState("2611606"); // Recife por padrão
  const [dadosApi, setDadosApi] = useState<INMETPrevisaoCompleta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const buscarDados = async () => {
    if (!codigoMunicipio.trim()) {
      setError("Por favor, informe um código de município válido");
      return;
    }

    setIsLoading(true);
    setError("");
    setDadosApi(null);

    try {
      console.log(`🌤️ [DADOS API] Buscando dados para município: ${codigoMunicipio}`);
      const dados = await getPrevisaoPorCodigo(codigoMunicipio);

      if (dados) {
        setDadosApi(dados);
        console.log("✅ [DADOS API] Dados obtidos com sucesso");
      } else {
        setError("Nenhum dado encontrado para este código de município");
      }
    } catch (err) {
      console.error("❌ [DADOS API] Erro:", err);
      setError("Erro ao buscar dados da API");
    } finally {
      setIsLoading(false);
    }
  };

  // Busca automática ao carregar a página
  useEffect(() => {
    const buscarDadosIniciais = async () => {
      if (!codigoMunicipio.trim()) {
        setError("Por favor, informe um código de município válido");
        return;
      }

      setIsLoading(true);
      setError("");
      setDadosApi(null);

      try {
        console.log(`🌤️ [DADOS API] Buscando dados para município: ${codigoMunicipio}`);
        const dados = await getPrevisaoPorCodigo(codigoMunicipio);

        if (dados) {
          setDadosApi(dados);
          console.log("✅ [DADOS API] Dados obtidos com sucesso");
        } else {
          setError("Nenhum dado encontrado para este código de município");
        }
      } catch (err) {
        console.error("❌ [DADOS API] Erro:", err);
        setError("Erro ao buscar dados da API");
      } finally {
        setIsLoading(false);
      }
    };

    buscarDadosIniciais();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatarDados = (dados: INMETPrevisaoCompleta) => {
    return JSON.stringify(dados, null, 2);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-600">
              🌤️ Dados da API INMET
            </CardTitle>
            <CardDescription>
              Consulte os dados meteorológicos diretamente da API oficial do INMET.
              Os dados são exibidos exatamente como retornados pela API.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Controles de Busca */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔍 Buscar Previsão</CardTitle>
            <CardDescription>
              Informe o código do município para buscar a previsão meteorológica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="codigo" className="block text-sm font-medium mb-2">
                  Código do Município:
                </label>
                <Input
                  id="codigo"
                  type="text"
                  value={codigoMunicipio}
                  onChange={(e) => setCodigoMunicipio(e.target.value)}
                  placeholder="2611606 (Recife/PE)"
                  className="font-mono"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={buscarDados}
                  disabled={isLoading}
                  className="px-6"
                >
                  {isLoading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </div>

            {/* Códigos de Exemplo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCodigoMunicipio("2611606")}
                className="text-left justify-start"
              >
                <div>
                  <div className="font-semibold">Recife/PE</div>
                  <div className="text-gray-500">2611606</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCodigoMunicipio("3550308")}
                className="text-left justify-start"
              >
                <div>
                  <div className="font-semibold">São Paulo/SP</div>
                  <div className="text-gray-500">3550308</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCodigoMunicipio("3304557")}
                className="text-left justify-start"
              >
                <div>
                  <div className="font-semibold">Rio de Janeiro/RJ</div>
                  <div className="text-gray-500">3304557</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCodigoMunicipio("5300108")}
                className="text-left justify-start"
              >
                <div>
                  <div className="font-semibold">Brasília/DF</div>
                  <div className="text-gray-500">5300108</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Área de Erro */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <span>❌</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dados da API */}
        {dadosApi && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📋 Dados Retornados pela API</CardTitle>
              <CardDescription>
                Dados meteorológicos estruturados conforme retornados pela API oficial do INMET
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {formatarDados(dadosApi)}
                </pre>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Resumo dos Dados:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(dadosApi).map(([codigoMunicipio, dadosMunicipio]) => (
                    <div key={codigoMunicipio} className="space-y-2">
                      <div>
                        <span className="font-semibold">Município:</span> {codigoMunicipio}
                      </div>
                      <div>
                        <span className="font-semibold">Datas disponíveis:</span> {Object.keys(dadosMunicipio).length}
                      </div>
                      <div>
                        <span className="font-semibold">Períodos por dia:</span> 3 (manhã, tarde, noite)
                      </div>
                      <div className="text-xs text-gray-600">
                        Datas: {Object.keys(dadosMunicipio).join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações sobre a Estrutura */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">📚 Estrutura dos Dados</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="space-y-3">
              <div>
                <strong>Organização:</strong> Os dados são organizados por código do município → data → período do dia
              </div>
              <div>
                <strong>Períodos:</strong> manhã, tarde, noite
              </div>
              <div>
                <strong>Campos principais:</strong>
                <ul className="mt-2 ml-4 space-y-1 text-sm">
                  <li>• <code>temp_min</code>, <code>temp_max</code> - Temperaturas mínima e máxima</li>
                  <li>• <code>resumo</code> - Resumo das condições meteorológicas</li>
                  <li>• <code>ico</code>, <code>icone</code> - Ícone representativo do tempo</li>
                  <li>• <code>umidade_min</code>, <code>umidade_max</code> - Umidade relativa</li>
                  <li>• <code>vento_dir</code>, <code>vento_int</code> - Direção e intensidade do vento</li>
                  <li>• <code>indice_uv</code> - Índice ultravioleta</li>
                  <li>• <code>nascer</code>, <code>ocaso</code> - Horários do nascer e pôr do sol</li>
                  <li>• <code>fase_lua</code> - Fase lunar atual</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
