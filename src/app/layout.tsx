/**
 * @fileoverview Layout raiz da aplicação Next.js
 * Define a estrutura HTML básica e metadados globais
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/** Configuração da fonte Inter do Google Fonts */
const inter = Inter({ subsets: ["latin"] });

/** Metadados globais da aplicação */
export const metadata: Metadata = {
  title: "Previsão do Tempo INMET",
  description: "Aplicação de previsão do tempo com dados oficiais do Instituto Nacional de Meteorologia (INMET)",
};

/**
 * Componente de layout raiz da aplicação
 * 
 * @component
 * @param children - Componentes filhos que serão renderizados dentro do layout
 * @returns Estrutura HTML básica com fontes e estilos globais
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
