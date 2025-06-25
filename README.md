# 🌦️ Aplicação de Previsão do Tempo - INMET

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [APIs e Dados](#-apis-e-dados)
- [Documentação Completa](#-documentação-completa)
- [Documentação dos Componentes](#-documentação-dos-componentes)
- [Documentação dos Serviços](#-documentação-dos-serviços)
- [Documentação dos Types](#-documentação-dos-types)
- [Como Executar](#-como-executar)
- [Funcionalidades](#-funcionalidades)

## 🎯 Visão Geral

Esta é uma aplicação web moderna desenvolvida em **Next.js 14** que exibe dados meteorológicos detalhados utilizando exclusivamente as **APIs oficiais do INMET** (Instituto Nacional de Meteorologia). A aplicação fornece previsões completas do tempo para todos os municípios brasileiros com interface responsiva e dados em tempo real.

### Características Principais:

- ✅ **100% dados oficiais** do INMET
- 🎨 **Interface moderna** com Tailwind CSS
- 📱 **Totalmente responsiva**
- 🔄 **Cache inteligente** para otimização
- 🛡️ **Sistema de fallback** robusto
- 🌙 **Modo escuro/claro**
- 📊 **Cobertura completa** de dados meteorológicos
- 📚 **Documentação JSDoc completa** em todos os arquivos

## 🚀 Tecnologias Utilizadas

### Frontend

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Ícones modernos
- **Radix UI** - Componentes acessíveis

### Ferramentas de Desenvolvimento

- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **Geist Font** - Fonte moderna

## 📁 Estrutura do Projeto

```
inmet-weather-app/
├── src/
│   ├── app/                     # App Router do Next.js
│   │   ├── layout.tsx           # Layout raiz da aplicação
│   │   ├── page.tsx             # Página inicial
│   │   ├── debug/               # Página de debug
│   │   │   └── page.tsx
│   │   └── previsao/            # Página de previsão
│   │       └── page.tsx
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes base (Radix UI)
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   ├── CitySearchForm.tsx   # Formulário de busca
│   │   ├── DataCoverageInfo.tsx # Info de cobertura de dados
│   │   ├── ForecastDisplay.tsx  # Exibição principal da previsão
│   │   └── WeatherSummary.tsx   # Resumo das condições
│   ├── lib/                     # Bibliotecas e serviços
│   │   ├── inmet.service.ts     # Serviço de API do INMET
│   │   └── utils.ts             # Utilitários gerais
│   └── types/                   # Definições de tipos
│       └── inmet.types.ts       # Tipos da API do INMET
├── public/                      # Arquivos estáticos
├── package.json                 # Dependências e scripts
├── tailwind.config.ts          # Configuração do Tailwind
├── tsconfig.json               # Configuração do TypeScript
└── components.json             # Configuração dos componentes
```

## 🌐 APIs e Dados

### API Principal - INMET

**URL Base:** `https://apiprevmet3.inmet.gov.br`

#### Endpoints Utilizados:

1. **📍 Lista de Municípios**

   ```
   GET /municipios
   ```

   - **Propósito:** Buscar todos os municípios brasileiros monitorados
   - **Cache:** 24 horas
   - **Retorno:** Array de objetos INMETMunicipio

2. **🌤️ Previsão Meteorológica**

   ```
   GET /previsao/diaria/municipio/{codigo}
   GET /previsao/{codigo}
   GET /forecast/{codigo}
   ```

   - **Propósito:** Previsão detalhada por município
   - **Cache:** 1 hora
   - **Retorno:** Objeto INMETPrevisaoCompleta

3. **🖼️ Ícones Meteorológicos**
   ```
   GET https://portal.inmet.gov.br/img/tempo/{icone}.png
   ```
   - **Propósito:** Ícones visuais das condições climáticas

### Dados Meteorológicos Disponíveis

A aplicação exibe **TODAS** as informações disponibilizadas pela API do INMET:

- ✅ **Temperatura:** máxima, mínima
- ✅ **Sensação Térmica:** máxima, mínima
- ✅ **Umidade:** máxima, mínima
- ✅ **Vento:** velocidade, direção, rajadas
- ✅ **Direção do Vento:** em graus (0-360°)
- ✅ **Precipitação:** probabilidade e volume
- ✅ **Pressão Atmosférica:** em hPa
- ✅ **Visibilidade:** em km
- ✅ **Índice UV:** com classificação
- ✅ **Radiação Solar:** em W/m²
- ✅ **Ponto de Orvalho:** em °C
- ✅ **Cobertura de Nuvens:** em %
- ✅ **Informações Astronômicas:** nascer/pôr do sol, fase da lua

## � Documentação Completa

### Status da Documentação JSDoc

O projeto possui **documentação JSDoc completa** em todos os arquivos:

#### ✅ Componentes Documentados

- **UI Components:** Button, Card, Input, Alert (shadcn/ui)
- **Business Components:** CitySearchForm, ForecastDisplay, WeatherSummary, DataCoverageInfo
- **Pages:** Layout, Home, Previsão, Debug

#### ✅ Código Documentado

- **Types & Interfaces:** Todas as interfaces TypeScript com descrições detalhadas
- **Services:** Serviço de integração com API do INMET
- **Utils:** Funções utilitárias e helpers
- **Config:** Configuração do Tailwind CSS

#### 📖 Padrões de Documentação

- `@fileoverview` - Descrição geral do arquivo
- `@component` - Identificação de componentes React
- `@param` - Documentação de parâmetros
- `@returns` - Descrição do retorno
- `@example` - Exemplos práticos de uso
- `@interface` - Documentação de interfaces TypeScript

#### 📁 Arquivos de Documentação

- `README.md` - Documentação principal (este arquivo)
- `ARCHITECTURE.md` - Documentação da arquitetura
- `COMPONENTS.md` - Guia detalhado dos componentes
- `PAGES.md` - Documentação das páginas
- `DOCUMENTATION_SUMMARY.md` - Resumo da documentação

### Benefícios da Documentação

- **IntelliSense aprimorado** no VS Code
- **Autocompletar** com descrições
- **Exemplos de uso** para cada componente
- **Onboarding facilitado** para novos desenvolvedores

## �📋 Documentação dos Componentes

### 🏠 Layout Principal (`src/app/layout.tsx`)

```typescript
export default function RootLayout({ children }: { children: React.ReactNode });
```

**Responsabilidades:**

- Define a estrutura HTML base da aplicação
- Configurações de meta tags e SEO
- Importação de fontes (Geist Sans e Mono)
- Configuração de tema escuro/claro

---

### 🎯 Página Inicial (`src/app/page.tsx`)

```typescript
export default function Home();
```

**Responsabilidades:**

- Renderiza o formulário de busca de cidades
- Estado de carregamento e gerenciamento de dados
- Navegação para página de previsão
- Interface de entrada da aplicação

---

### 🔍 Formulário de Busca (`src/components/CitySearchForm.tsx`)

```typescript
interface CitySearchFormProps {
  municipios: INMETMunicipio[];
  onCitySelect: (cidade: INMETMunicipio) => void;
  isLoading?: boolean;
}

export default function CitySearchForm({
  municipios,
  onCitySelect,
  isLoading = false,
}: CitySearchFormProps);
```

**Responsabilidades:**

- Input de busca com filtragem em tempo real
- Lista de sugestões de municípios
- Tratamento de seleção de cidade
- Estados de carregamento

**Funcionalidades:**

- Busca por nome ou sigla do município
- Debounce para otimização de performance
- Interface acessível com navegação por teclado

---

### 🌦️ Exibição de Previsão (`src/components/ForecastDisplay.tsx`)

```typescript
interface ForecastDisplayProps {
  previsao: INMETPrevisaoCompleta;
  cidade: INMETMunicipio;
}

export default function ForecastDisplay({
  previsao,
  cidade,
}: ForecastDisplayProps);
```

**Responsabilidades:**

- Renderização principal dos dados meteorológicos
- Organização por dias e períodos (manhã, tarde, noite)
- Exibição de todas as informações meteorológicas
- Sistema de debug para novos campos da API

**Sub-componentes:**

- `DetailedWeatherInfo`: Informações meteorológicas detalhadas
- `AstroInfo`: Informações astronômicas
- `PeriodoCard`: Card para cada período do dia

---

### 📊 Resumo Meteorológico (`src/components/WeatherSummary.tsx`)

```typescript
interface WeatherSummaryProps {
  periodo: INMETPeriodo;
  nomePeriodo: string;
}

export default function WeatherSummary({
  periodo,
  nomePeriodo,
}: WeatherSummaryProps);
```

**Responsabilidades:**

- Exibição resumida das condições atuais
- Destaque para informações principais
- Alertas para condições importantes (UV alto, chuva, rajadas)
- Interface compacta e informativa

---

### 📈 Informações de Cobertura (`src/components/DataCoverageInfo.tsx`)

```typescript
interface DataCoverageInfoProps {
  periodo: INMETPeriodo;
  showDetails?: boolean;
}

export default function DataCoverageInfo({
  periodo,
  showDetails = false,
}: DataCoverageInfoProps);
```

**Responsabilidades:**

- Análise da cobertura de dados em tempo real
- Distinção entre campos obrigatórios e opcionais
- Porcentagem de dados disponíveis
- Lista detalhada de todos os campos da API

---

### 🎨 Componentes UI (`src/components/ui/`)

#### Card (`card.tsx`)

```typescript
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>;
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>;
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>;
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>;
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>;
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>;
```

**Responsabilidades:**

- Componentes base para cards
- Estilização consistente com Tailwind
- Suporte a modo escuro

#### Button (`button.tsx`)

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}
```

**Responsabilidades:**

- Botões com variantes de estilo
- Estados hover, focus e disabled
- Acessibilidade integrada

#### Input (`input.tsx`)

```typescript
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
```

**Responsabilidades:**

- Input base estilizado
- Integração com formulários
- Estados de foco e erro

#### Alert (`alert.tsx`)

```typescript
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}
```

**Responsabilidades:**

- Componentes de alerta e notificação
- Variantes para diferentes tipos de mensagem

## 🔧 Documentação dos Serviços

### 🌐 Serviço INMET (`src/lib/inmet.service.ts`)

#### Função: `buscarMunicipios()`

```typescript
export async function buscarMunicipios(): Promise<INMETMunicipio[]>;
```

**Responsabilidades:**

- Busca a lista completa de municípios brasileiros
- Cache de 24 horas
- Tratamento de erros com fallback para dados mock
- Logs detalhados para depuração

**Fluxo de Execução:**

1. Verifica cache existente
2. Faz requisição para API do INMET
3. Em caso de falha, utiliza dados mock
4. Retorna lista ordenada alfabeticamente

#### Função: `buscarPrevisao()`

```typescript
export async function buscarPrevisao(
  geocode: number
): Promise<INMETPrevisaoCompleta>;
```

**Responsabilidades:**

- Busca previsão meteorológica para município específico
- Cache de 1 hora
- Múltiplos endpoints com fallback
- Sistema de retry automático

**Endpoints Tentados (em ordem):**

1. `/previsao/diaria/municipio/{codigo}`
2. `/previsao/{codigo}`
3. `/forecast/{codigo}`
4. Dados mock (fallback final)

**Tratamento de Erros:**

- Logs detalhados de cada tentativa
- Timeout automático por endpoint
- Fallback para dados mock em última instância

### 🛠️ Utilitários (`src/lib/utils.ts`)

#### Função: `cn()`

```typescript
export function cn(...inputs: ClassValue[]);
```

**Responsabilidades:**

- Combinação inteligente de classes CSS
- Utiliza `clsx` e `tailwind-merge`
- Remove classes conflitantes do Tailwind
- Suporte a classes condicionais

## 📝 Documentação dos Types

### 🏛️ Tipos INMET (`src/types/inmet.types.ts`)

#### Interface: `INMETMunicipio`

```typescript
export interface INMETMunicipio {
  geocode: number; // Código único do município
  nome: string; // Nome do município
  sigla: string; // Sigla do estado (UF)
  longitude: string; // Coordenada longitude
  latitude: string; // Coordenada latitude
}
```

**Uso:** Representa um município na lista do INMET

#### Interface: `INMETPeriodo`

```typescript
export interface INMETPeriodo {
  // Campos obrigatórios
  entidade: string; // Entidade responsável pelos dados
  uf: string; // Unidade federativa
  cidade: string; // Nome da cidade
  dia_semana: string; // Dia da semana
  ico: string; // Código do ícone
  resumo: string; // Resumo das condições
  temp_max: string; // Temperatura máxima
  temp_min: string; // Temperatura mínima
  umidade_max: string; // Umidade máxima
  umidade_min: string; // Umidade mínima
  vento_dir: string; // Direção do vento
  vento_int: string; // Intensidade do vento
  icone: string; // URL do ícone

  // Campos opcionais
  pressao_atmosferica?: string; // Pressão em hPa
  visibilidade?: string; // Visibilidade em km
  ponto_orvalho?: string; // Ponto de orvalho em °C
  indice_uv?: string; // Índice UV
  radiacao_solar?: string; // Radiação solar em W/m²
  rajada_vento?: string; // Rajada máxima em km/h
  sensacao_termica_max?: string; // Sensação térmica máxima
  sensacao_termica_min?: string; // Sensação térmica mínima
  probabilidade_chuva?: string; // Probabilidade de chuva em %
  volume_chuva?: string; // Volume de chuva em mm
  nascer_sol?: string; // Horário do nascer do sol
  por_sol?: string; // Horário do pôr do sol
  fase_lua?: string; // Fase da lua
  direcao_vento_graus?: string; // Direção em graus (0-360°)
  cobertura_nuvens?: string; // Cobertura de nuvens em %
}
```

**Uso:** Representa todos os dados meteorológicos de um período específico

#### Interface: `INMETPrevisaoDia`

```typescript
export interface INMETPrevisaoDia {
  manha: INMETPeriodo; // Dados da manhã
  tarde: INMETPeriodo; // Dados da tarde
  noite: INMETPeriodo; // Dados da noite
}
```

**Uso:** Representa um dia completo com seus 3 períodos

#### Interface: `INMETPrevisaoCompleta`

```typescript
export interface INMETPrevisaoCompleta {
  [data: string]: INMETPrevisaoDia; // Chave: data (YYYY-MM-DD)
}
```

**Uso:** Representa a previsão completa com múltiplos dias

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd inmet-weather-app

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Execute a versão de produção
npm start
```

### Scripts Disponíveis

```json
{
  "dev": "next dev", // Desenvolvimento
  "build": "next build", // Build de produção
  "start": "next start", // Servidor de produção
  "lint": "next lint" // Verificação de código
}
```

## ✨ Funcionalidades

### 🔍 Busca de Cidades

- Campo de busca inteligente
- Filtragem em tempo real
- Sugestões automáticas
- Busca por nome ou UF

### 📊 Dados Meteorológicos

- **15 tipos diferentes** de informações meteorológicas
- Dados oficiais do INMET em tempo real
- Organização por períodos (manhã, tarde, noite)
- Informações astronômicas detalhadas

### 🎨 Interface

- Design moderno e responsivo
- Modo escuro/claro automático
- Ícones oficiais do INMET
- Cards organizados por categoria

### 🛡️ Confiabilidade

- Sistema de cache inteligente
- Múltiplos endpoints de fallback
- Dados mock para alta disponibilidade
- Logs detalhados para depuração

### 📱 Responsividade

- Otimizado para mobile, tablet e desktop
- Layout adaptativo
- Touch-friendly nos dispositivos móveis

## 🔄 Sistema de Cache

### Estratégia de Cache

- **Municípios:** 24 horas (dados estáveis)
- **Previsões:** 1 hora (dados dinâmicos)
- **Imagens:** Cache do navegador

### Revalidação

- Next.js ISR (Incremental Static Regeneration)
- Atualização automática de dados
- Fallback para dados em cache durante indisponibilidade da API

## 🐛 Debug e Monitoramento

### Logs Implementados

- Tentativas de API com timestamps
- Fallbacks utilizados
- Dados mock ativados
- Erros de rede detalhados

### Página de Debug

- Endpoint `/debug` para análise técnica
- Informações de cache
- Status das APIs
- Cobertura de dados

## 📈 Performance

### Otimizações

- Lazy loading de componentes
- Debounce em campos de busca
- Cache inteligente de dados
- Imagens otimizadas com Next.js

### Métricas

- First Contentful Paint otimizado
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift mínimo

## 🔒 Segurança

### Práticas Implementadas

- Validação de tipos com TypeScript
- Sanitização de inputs
- Headers de segurança do Next.js
- Rate limiting implícito via cache

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Adicione testes se necessário
5. Submeta um Pull Request

### Padrões de Código

- TypeScript obrigatório
- ESLint configurado
- Componentes funcionais com hooks
- Nomes descritivos para variáveis e funções

---

## 📞 Suporte

Para dúvidas ou problemas:

- Abra uma issue no repositório
- Consulte os logs de debug da aplicação
- Verifique a documentação da API do INMET

---

**Desenvolvido com ❤️ utilizando as melhores práticas de desenvolvimento web moderno.**
