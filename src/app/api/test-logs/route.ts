/**
 * @fileoverview API Route para forçar logs detalhados das chamadas INMET
 * Este endpoint força a execução de todas as funções do serviço INMET
 * para visualizar todos os logs no terminal do servidor
 */

import { NextRequest, NextResponse } from "next/server";
import { getTodosMunicipios, getPrevisaoPorCodigo } from "@/lib/inmet.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const test = searchParams.get("test") || "all";

  console.log("=".repeat(100));
  console.log("🚀 [API TEST ROUTE] INICIANDO TESTES DE LOGS DA API INMET");
  console.log("=".repeat(100));

  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
  };

  try {
    // Teste 1: Buscar municípios
    if (test === "all" || test === "municipios") {
      console.log("\n📍 [API TEST] Executando teste de municípios...");
      const startTime = performance.now();

      const municipios = await getTodosMunicipios();

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      results.tests.push({
        type: "municipios",
        success: true,
        count: municipios.length,
        duration: `${duration}ms`,
        message: `${municipios.length} municípios obtidos com sucesso`,
      });

      console.log(
        `✅ [API TEST] Teste de municípios concluído: ${municipios.length} municípios em ${duration}ms`
      );
    }

    // Teste 2: Buscar previsão (São Paulo)
    if (test === "all" || test === "previsao") {
      const codigoTeste = "3550308"; // São Paulo
      console.log(
        `\n🌤️  [API TEST] Executando teste de previsão para código: ${codigoTeste}`
      );
      const startTime = performance.now();

      const previsao = await getPrevisaoPorCodigo(codigoTeste);

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const success = previsao !== null;
      let periodos = 0;

      if (previsao && typeof previsao === "object") {
        Object.keys(previsao).forEach((codigoMunicipio) => {
          const dadosMunicipio = previsao[codigoMunicipio];
          if (typeof dadosMunicipio === "object") {
            Object.keys(dadosMunicipio).forEach((data) => {
              const dadosData = dadosMunicipio[data];
              if (typeof dadosData === "object") {
                periodos += Object.keys(dadosData).length;
              }
            });
          }
        });
      }

      results.tests.push({
        type: "previsao",
        success,
        codigo: codigoTeste,
        periodos,
        duration: `${duration}ms`,
        message: success
          ? `Previsão obtida com ${periodos} períodos`
          : "Falha ao obter previsão",
      });

      console.log(
        `${success ? "✅" : "❌"} [API TEST] Teste de previsão concluído: ${
          success ? `${periodos} períodos` : "FALHA"
        } em ${duration}ms`
      );
    }

    console.log("=".repeat(100));
    console.log("🎉 [API TEST ROUTE] TODOS OS TESTES CONCLUÍDOS COM SUCESSO!");
    console.log("=".repeat(100));

    return NextResponse.json({
      success: true,
      message:
        "Testes executados com sucesso. Verifique os logs no terminal do servidor.",
      results,
    });
  } catch (error) {
    console.log("=".repeat(100));
    console.error("❌ [API TEST ROUTE] ERRO DURANTE OS TESTES:", error);
    console.log("=".repeat(100));

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        results,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { test = "all", codigo = "3550308" } = body;

  console.log("=".repeat(100));
  console.log("🚀 [API TEST POST] TESTE PERSONALIZADO INICIADO");
  console.log(`📋 Parâmetros: test=${test}, codigo=${codigo}`);
  console.log("=".repeat(100));

  try {
    let result = null;

    if (test === "municipios") {
      result = await getTodosMunicipios();
    } else if (test === "previsao") {
      result = await getPrevisaoPorCodigo(codigo);
    } else {
      // Executa ambos
      const municipios = await getTodosMunicipios();
      const previsao = await getPrevisaoPorCodigo(codigo);
      result = { municipios, previsao };
    }

    console.log("=".repeat(100));
    console.log("🎉 [API TEST POST] TESTE PERSONALIZADO CONCLUÍDO!");
    console.log("=".repeat(100));

    return NextResponse.json({
      success: true,
      message: "Teste personalizado executado com sucesso",
      data: result ? "Dados obtidos (verifique logs)" : "Nenhum dado obtido",
    });
  } catch (error) {
    console.log("=".repeat(100));
    console.error("❌ [API TEST POST] ERRO NO TESTE PERSONALIZADO:", error);
    console.log("=".repeat(100));

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
