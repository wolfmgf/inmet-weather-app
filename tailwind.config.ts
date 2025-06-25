/**
 * @fileoverview Configuração do Tailwind CSS para o projeto
 * Define tema customizado, cores e extensões para o sistema de design
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

import type { Config } from "tailwindcss";

/**
 * Configuração principal do Tailwind CSS
 * Integra com shadcn/ui e define sistema de cores e estilos customizados
 */
const config: Config = {
  /** Modo escuro baseado em classe CSS */
  darkMode: ["class"],

  /** Arquivos onde o Tailwind deve procurar por classes CSS */
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      /** Gradientes customizados para backgrounds */
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      /** Border radius usando variáveis CSS customizadas */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /** Sistema de cores integrado com shadcn/ui usando CSS variables */
      colors: {
        /** Cores de fundo e texto base */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /** Cores para componentes Card */
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /** Cores para componentes Popover */
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        /** Cores primárias para botões e elementos principais */
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        /** Cores secundárias para elementos de suporte */
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        /** Cores para elementos menos prominentes */
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        /** Cores para elementos de destaque */
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        /** Cores para elementos destrutivos (botões de exclusão, etc.) */
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        /** Cores para bordas e elementos de interface */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        /** Cores para gráficos e visualizações */
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },

  /** Plugins do Tailwind CSS */
  plugins: [require("tailwindcss-animate")],
};

export default config;
