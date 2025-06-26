/**
 * @fileoverview Página de Debug - Visualização de logs detalhados da API INMET
 * 
 * Esta página é destinada a desenvolvedores e administradores para
 * monitorar e debugar as chamadas da API do INMET em tempo real.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTodosMunicipios, getPrevisaoPorCodigo } from "@/lib/inmet.service";
import { INMETMunicipio } from "@/types/inmet.types";

// Interface para representar um log
interface LogEntry {
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
}

export default function DebugPage() {
  const [isLoadingMunicipios, setIsLoadingMunicipios] = useState(false);
  const [isLoadingPrevisao, setIsLoadingPrevisao] = useState(false);
  const [codigoMunicipio, setCodigoMunicipio] = useState("3550308"); // São Paulo por padrão
  const [ultimoTeste, setUltimoTeste] = useState<string>("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLogsVisible, setIsLogsVisible] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    const addLog = (level: LogEntry['level'], ...args: any[]) => {
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      const newLog: LogEntry = {
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        level,
        message
      };

      setLogs(prevLogs => [...prevLogs.slice(-49), newLog]); // Mantém apenas os últimos 50 logs
    };

    console.log = (...args) => {
      originalConsoleLog(...args);
      addLog('log', ...args);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      addLog('error', ...args);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      addLog('warn', ...args);
    };

    console.info = (...args) => {
      originalConsoleInfo(...args);
      addLog('info', ...args);
    };

    // Log inicial para indicar que o sistema de logs está ativo
    console.log("🔧 [DEBUG PAGE] Sistema de captura de logs ativado");

    // Cleanup quando o componente for desmontado
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
    };
  }, []);

  // Auto-scroll para o final dos logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  const toggleLogsVisibility = () => {
    setIsLogsVisible(!isLogsVisible);
  };

  const testarBuscaMunicipios = async () => {
    setIsLoadingMunicipios(true);
    setUltimoTeste("Iniciando busca de municípios...");
    console.log("🚀 [DEBUG PAGE] =".repeat(20));
    console.log("🚀 [DEBUG PAGE] TESTE DE BUSCA DE MUNICÍPIOS INICIADO");
    console.log("🚀 [DEBUG PAGE] =".repeat(20));

    try {
      const municipios = await getTodosMunicipios();
      setUltimoTeste(`✅ Sucesso! ${municipios.length} municípios carregados.`);
      console.log(`✅ [DEBUG PAGE] Teste concluído: ${municipios.length} municípios obtidos`);
    } catch (error) {
      console.error("❌ [DEBUG PAGE] Erro:", error);
      setUltimoTeste(`❌ Erro ao buscar municípios: ${error}`);
    } finally {
      setIsLoadingMunicipios(false);
      console.log("🏁 [DEBUG PAGE] Teste de municípios finalizado");
    }
  };

  const testarBuscaPrevisao = async () => {
    setIsLoadingPrevisao(true);
    setUltimoTeste(`Iniciando busca de previsão para código: ${codigoMunicipio}...`);
    console.log("🌤️ [DEBUG PAGE] =".repeat(20));
    console.log(`🌤️ [DEBUG PAGE] TESTE DE PREVISÃO INICIADO - Código: ${codigoMunicipio}`);
    console.log("🌤️ [DEBUG PAGE] =".repeat(20));

    try {
      const previsao = await getPrevisaoPorCodigo(codigoMunicipio);

      if (previsao) {
        setUltimoTeste(`✅ Sucesso! Previsão obtida para código ${codigoMunicipio}.`);
        console.log(`✅ [DEBUG PAGE] Teste concluído: previsão obtida para ${codigoMunicipio}`);
      } else {
        setUltimoTeste(`⚠️ Nenhuma previsão encontrada para código ${codigoMunicipio}.`);
        console.log(`⚠️ [DEBUG PAGE] Nenhuma previsão encontrada para ${codigoMunicipio}`);
      }
    } catch (error) {
      console.error("❌ [DEBUG PAGE] Erro:", error);
      setUltimoTeste(`❌ Erro ao buscar previsão: ${error}`);
    } finally {
      setIsLoadingPrevisao(false);
      console.log("🏁 [DEBUG PAGE] Teste de previsão finalizado");
    }
  };

  const testarAmbos = async () => {
    console.log("🚀 [DEBUG PAGE] INICIANDO TESTE COMPLETO - MUNICÍPIOS + PREVISÃO");
    await testarBuscaMunicipios();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda 2s
    await testarBuscaPrevisao();
    console.log("🏁 [DEBUG PAGE] TESTE COMPLETO FINALIZADO");
  };

  // Função para obter a cor do log baseada no nível
  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-600';
      case 'warn': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-800';
    }
  };

  // Função para obter o ícone do log baseado no nível
  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-600">
              🔧 Debug - API INMET
            </CardTitle>
            <CardDescription>
              Página de debug para monitorar e testar as chamadas da API do INMET.
              Os logs aparecem em tempo real na seção abaixo e também no console do terminal.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Controles de Teste */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teste de Municípios */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🏙️ Teste de Municípios</CardTitle>
              <CardDescription>
                Testa a busca da lista completa de municípios do INMET
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={testarBuscaMunicipios}
                disabled={isLoadingMunicipios}
                className="w-full"
              >
                {isLoadingMunicipios ? "Buscando..." : "Buscar Municípios"}
              </Button>
            </CardContent>
          </Card>

          {/* Teste de Previsão */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🌤️ Teste de Previsão</CardTitle>
              <CardDescription>
                Testa a busca de previsão para um município específico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium mb-2">
                  Código do Município:
                </label>
                <Input
                  id="codigo"
                  type="text"
                  value={codigoMunicipio}
                  onChange={(e) => setCodigoMunicipio(e.target.value)}
                  placeholder="3550308 (São Paulo)"
                  className="mb-3"
                />
              </div>
              <Button
                onClick={testarBuscaPrevisao}
                disabled={isLoadingPrevisao}
                className="w-full"
              >
                {isLoadingPrevisao ? "Buscando..." : "Buscar Previsão"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Teste Completo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🚀 Teste Completo</CardTitle>
            <CardDescription>
              Executa ambos os testes em sequência para visualizar todos os logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={testarAmbos}
              disabled={isLoadingMunicipios || isLoadingPrevisao}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {(isLoadingMunicipios || isLoadingPrevisao) ? "Executando..." : "Executar Teste Completo"}
            </Button>
          </CardContent>
        </Card>

        {/* Console de Logs em Tempo Real */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">📋 Console de Logs em Tempo Real</CardTitle>
              <CardDescription>
                Logs das chamadas da API do INMET aparecem aqui automaticamente
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLogsVisibility}
              >
                {isLogsVisible ? "Ocultar" : "Mostrar"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearLogs}
                className="text-red-600 hover:text-red-700"
              >
                Limpar
              </Button>
            </div>
          </CardHeader>
          {isLogsVisible && (
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-gray-500 italic">
                    Nenhum log ainda. Execute um teste para ver os logs aparecerem aqui.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-gray-400 text-xs min-w-20">
                          {log.timestamp}
                        </span>
                        <span className="text-xs">
                          {getLogIcon(log.level)}
                        </span>
                        <span className={`flex-1 ${getLogColor(log.level)} break-words whitespace-pre-wrap`}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                💡 Os logs mais antigos são removidos automaticamente para manter a performance.
                Total de logs: {logs.length}/50
              </div>
            </CardContent>
          )}
        </Card>

        {/* Status do Último Teste */}
        {ultimoTeste && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Status do Último Teste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm font-mono">{ultimoTeste}</p>
                <p className="text-xs text-gray-600 mt-2">
                  ✅ Logs detalhados estão sendo exibidos no console acima e também no terminal do servidor
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Códigos de Exemplo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📋 Códigos de Exemplo</CardTitle>
            <CardDescription>
              Códigos de municípios para teste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded border">
                <strong>São Paulo/SP</strong><br />
                <code>3550308</code>
              </div>
              <div className="p-3 bg-green-50 rounded border">
                <strong>Rio de Janeiro/RJ</strong><br />
                <code>3304557</code>
              </div>
              <div className="p-3 bg-yellow-50 rounded border">
                <strong>Belo Horizonte/MG</strong><br />
                <code>3106200</code>
              </div>
              <div className="p-3 bg-purple-50 rounded border">
                <strong>Brasília/DF</strong><br />
                <code>5300108</code>
              </div>
              <div className="p-3 bg-red-50 rounded border">
                <strong>Curitiba/PR</strong><br />
                <code>4106902</code>
              </div>
              <div className="p-3 bg-indigo-50 rounded border">
                <strong>Porto Alegre/RS</strong><br />
                <code>4314902</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg text-orange-800">📝 Instruções</CardTitle>
          </CardHeader>
          <CardContent className="text-orange-700">
            <ol className="list-decimal list-inside space-y-2">
              <li>Execute qualquer um dos testes acima</li>
              <li>Observe os logs aparecerem em tempo real no console acima</li>
              <li>Os logs também aparecem no terminal onde o servidor Next.js está rodando</li>
              <li>
                Os logs incluem:
                <div className="ml-6 mt-2 space-y-1">
                  <div>• URLs das requisições</div>
                  <div>• Tempos de resposta</div>
                  <div>• Status codes HTTP</div>
                  <div>• Headers das respostas</div>
                  <div>• Dados completos retornados pela API</div>
                  <div>• Análise estatística dos dados</div>
                  <div>• Campos extras detectados</div>
                </div>
              </li>
              <li>Use o botão &quot;Limpar&quot; para limpar o console de logs</li>
              <li>Use o botão &quot;Ocultar/Mostrar&quot; para controlar a visibilidade dos logs</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
