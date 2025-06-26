# 🌦️ Aplicação de Previsão do Tempo - INMET

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [APIs e Dados](#-apis-e-dados)
- [Documentação Completa](#-documentação-completa)
- [Documentação dos Componentes](#-documentação-dos-componentes)
- [Documentação dos Serviços](#-documentação-dos-serviços)
- [Documentação dos Types](#-documentação-dos-types)
- [Como Executar](#-como-executar)
- [Funcionalidades](#-funcionalidades)

## 🎯 Visão Geral

Esta é uma aplicação web moderna desenvolvida em **Next.js 14** que exibe dados meteorológicos detalhados utilizando exclusivamente as **APIs oficiais do INMET** (Instituto Nacional de Meteorologia). A aplicação fornece previsões completas do tempo para todos os municípios brasileiros com interface responsiva, mapa interativo e dados em tempo real.

### Características Principais:

- ✅ **100% dados oficiais** do INMET
- 🗺️ **Mapa interativo** com OpenStreetMap para seleção de localização
- 🎨 **Interface moderna** com Tailwind CSS
- 📱 **Totalmente responsiva**
- 🔄 **Cache inteligente** para otimização
- 🛡️ **Sistema de fallback** robusto
- 🌙 **Modo escuro/claro**
- 📊 **Cobertura completa** de dados meteorológicos
- 📚 **Documentação JSDoc completa** em todos os arquivos
- 🔍 **Busca por nome ou navegação via mapa**
- ⚡ **Single Page Application (SPA)** para navegação fluida

## 🚀 Funcionalidades Principais

### 🗺️ Navegação por Mapa Interativo

- **OpenStreetMap integrado** com funcionalidade de clique
- **Seleção visual de localização** em qualquer ponto do Brasil
- **Popup informativo** com nome do município mais próximo
- **Navegação direta** para previsão via SPA
- **Renderização otimizada** apenas no cliente (evita problemas de SSR)

### 🔍 Sistema de Busca Avançado

- **Busca textual** por nome de município
- **Normalização de strings** (remove acentos para melhor busca)
- **Suporte a múltiplos parâmetros** (código geocode ou nome da cidade)
- **Fallback robusto** entre diferentes endpoints da API

### 📊 Dados Meteorológicos Completos

- **Normalização automática** de campos da API
- **Exibição de todos os dados disponíveis:**
  - Temperatura (máxima/mínima)
  - **Pressão Atmosférica** (hPa)
  - **Visibilidade** (km)
  - **Ponto de Orvalho** (°C)
  - **Índice UV** com classificação de risco
  - **Radiação Solar** (W/m²)
  - **Rajada de Vento** (km/h)
  - **Sensação Térmica** (máxima/mínima)
  - Umidade relativa
  - Velocidade e direção do vento
  - Precipitação (probabilidade e volume)
  - Cobertura de nuvens
  - Informações astronômicas (nascer/pôr do sol, fases da lua)

### 🛡️ Sistema de Robustez

- **Debug logging** para troubleshooting
- **Tratamento de campos alternativos** da API (ex: `uv` vs `indice_uv`)
- **Feedback visual** para estados de carregamento e erro
- **Validação de dados** antes da exibição

## 🚀 Tecnologias Utilizadas

### Frontend

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Ícones modernos
- **Radix UI** - Componentes acessíveis

### Mapa e Geolocalização

- **React Leaflet** - Integração do Leaflet com React
- **Leaflet** - Biblioteca de mapas interativos
- **OpenStreetMap** - Dados de mapa open source
- **@types/leaflet** - Tipagens TypeScript para Leaflet

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
│   │   ├── page.tsx             # Página inicial com abas (busca + mapa)
│   │   ├── globals.css          # Estilos globais (inclui Leaflet CSS)
│   │   ├── debug/               # Página de debug
│   │   │   └── page.tsx
│   │   └── previsao/            # Página de previsão
│   │       └── page.tsx         # Aceita parâmetros 'codigo' e 'cidade'
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes base (Radix UI)
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   ├── CitySearchForm.tsx   # Formulário de busca
│   │   ├── DataCoverageInfo.tsx # Info de cobertura de dados
│   │   ├── ForecastDisplay.tsx  # Exibição principal da previsão
│   │   ├── WeatherSummary.tsx   # Resumo das condições
│   │   ├── MapSelector.tsx      # Mapa interativo (Leaflet)
│   │   └── MapSelectorWrapper.tsx # Wrapper para renderização client-side
│   ├── lib/                     # Bibliotecas e serviços
│   │   ├── inmet.service.ts     # Serviço de API do INMET (com normalização)
│   │   └── utils.ts             # Utilitários gerais
│   └── types/                   # Definições de tipos
│       └── inmet.types.ts       # Tipos da API do INMET (completos)
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

A aplicação exibe **TODAS** as informações disponibilizadas pela API do INMET com sistema de normalização robusto:

#### 🌡️ Informações de Temperatura

- ✅ **Temperatura:** máxima, mínima
- ✅ **Sensação Térmica:** máxima, mínima (com ícones visuais)

#### 💨 Informações de Vento

- ✅ **Vento:** velocidade, direção, rajadas
- ✅ **Direção do Vento:** em graus (0-360°) com rosa dos ventos
- ✅ **Normalização:** suporte a campos `vento_int`, `wind_speed`, `velocidade_vento`

#### 🌧️ Informações de Precipitação

- ✅ **Precipitação:** probabilidade e volume
- ✅ **Umidade:** máxima, mínima

#### 🌍 Informações Atmosféricas

- ✅ **Pressão Atmosférica:** em hPa (hectopascais)
- ✅ **Visibilidade:** em km
- ✅ **Ponto de Orvalho:** em °C
- ✅ **Cobertura de Nuvens:** em %

#### ☀️ Informações Solares e UV

- ✅ **Índice UV:** com classificação de risco (Baixo/Moderado/Alto/Muito Alto/Extremo)
- ✅ **Radiação Solar:** em W/m²
- ✅ **Normalização:** suporte a campos `indice_uv`, `uv`

#### 🌅 Informações Astronômicas

- ✅ **Nascer/Pôr do Sol:** horários precisos
- ✅ **Fase da Lua:** estado atual
- ✅ **Suporte múltiplos formatos:** `nascer_sol`/`nascer`, `por_sol`/`ocaso`

## 📚 Documentação Completa

### Status da Documentação JSDoc

O projeto possui **documentação JSDoc completa** em todos os arquivos:

#### ✅ Componentes Documentados

- **UI Components:** Button, Card, Input, Alert (shadcn/ui)
- **Business Components:** CitySearchForm, ForecastDisplay, WeatherSummary, DataCoverageInfo
- **Map Components:** MapSelector, MapSelectorWrapper (OpenStreetMap)
- **Pages:** Layout, Home, Previsão, Debug

#### ✅ Código Documentado

- **Types & Interfaces:** Todas as interfaces TypeScript com descrições detalhadas
- **Services:** Serviço de integração com API do INMET (com normalização de campos)
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
- JSDoc inline - Documentação completa em todos os arquivos de código

### Benefícios da Documentação

- **IntelliSense aprimorado** no VS Code
- **Autocompletar** com descrições
- **Exemplos de uso** para cada componente
- **Onboarding facilitado** para novos desenvolvedores

## 📋 Documentação dos Componentes

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

- **Sistema de abas** com busca textual e navegação por mapa
- Renderização do formulário de busca de cidades
- **Integração do mapa interativo** via MapSelectorWrapper
- Estado de carregamento e gerenciamento de dados
- **Navegação SPA** para página de previsão

**Funcionalidades Atualizadas:**

- **Aba "Buscar Cidade":** formulário de busca tradicional
- **Aba "Navegar no Mapa":** mapa interativo OpenStreetMap
- **Transições suaves** entre abas
- **Responsividade** completa

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
- ✅ **Suporte múltiplos formatos:** `nascer_sol`/`nascer`, `por_sol`/`ocaso`

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
- Exibição de **todas** as informações meteorológicas disponíveis
- Sistema de debug para novos campos da API
- **Normalização robusta** de campos alternativos

**Sub-componentes atualizados:**

- `DetailedWeatherInfo`: Informações meteorológicas detalhadas com **todos os novos campos**:
  - Pressão Atmosférica (com ícone Gauge)
  - Visibilidade (com ícone Eye)
  - Ponto de Orvalho (com ícone Droplets)
  - Índice UV (com ícone Sun) - suporte a campos `indice_uv` e `uv`
  - Radiação Solar (com ícone Zap)
  - Rajada de Vento (com ícone Wind)
  - Sensação Térmica Máx/Mín (com ícone Thermometer)
  - Cobertura de Nuvens (com ícone Cloud)
  - Direção do Vento em Graus (com ícone Compass)
- `AstroInfo`: Informações astronômicas
- `ExtraWeatherInfo`: Campos extras detectados na API
- `PeriodoCard`: Card para cada período do dia

**Melhorias Implementadas:**

- **Cores diferenciadas** para cada tipo de informação
- **Ícones específicos** da biblioteca Lucide React
- **Suporte a campos alternativos** (ex: `uv` vs `indice_uv`)
- **Layout responsivo** em grid (1/2/3 colunas conforme tela)
- **Condicionais robustas** para exibir apenas dados disponíveis

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

### 🗺️ Mapa Interativo (`src/components/MapSelector.tsx`)

```typescript
interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number, municipio: string) => void;
}

export default function MapSelector({ onLocationSelect }: MapSelectorProps);
```

**Responsabilidades:**

- Renderização do mapa OpenStreetMap interativo
- Detecção de cliques no mapa
- Busca do município mais próximo via coordenadas
- Exibição de popup com informações do local
- Navegação para previsão via SPA

**Funcionalidades:**

- **Mapa Leaflet** com tiles do OpenStreetMap
- **Clique interativo** em qualquer ponto do Brasil
- **Busca automática** do município mais próximo por coordenadas
- **Popup informativo** com nome do município e botão de ação
- **Loading states** durante busca de localização
- **Tratamento de erros** para locais não encontrados

**Sub-componentes:**

- `MapContainer`: Container principal do Leaflet
- `TileLayer`: Camada de tiles do OpenStreetMap
- `MapClickHandler`: Componente que detecta cliques no mapa
- `Popup`: Componente de popup com informações

---

### 🔄 Wrapper do Mapa (`src/components/MapSelectorWrapper.tsx`)

```typescript
interface MapSelectorWrapperProps {
  onLocationSelect: (lat: number, lng: number, municipio: string) => void;
}

export default function MapSelectorWrapper({
  onLocationSelect,
}: MapSelectorWrapperProps);
```

**Responsabilidades:**

- Renderização condicional apenas no cliente
- Prevenção de erros de SSR/hidratação
- Loading state durante carregamento do mapa
- Lazy loading do componente MapSelector

**Funcionalidades:**

- **Dynamic import** do MapSelector
- **useEffect + useState** para controle de renderização
- **Loading skeleton** enquanto carrega
- **Prevenção de erros** de `window is not defined`

---

## 🔧 Documentação dos Serviços

### 🌐 Serviço INMET (`src/lib/inmet.service.ts`)

#### Função: `getTodosMunicipios()`

```typescript
export async function getTodosMunicipios(): Promise<INMETMunicipio[]>;
```

**Responsabilidades:**

- Busca a lista completa de municípios brasileiros
- Cache de 24 horas para otimização
- Tratamento de erros com fallback para dados mock
- Ordenação alfabética automática
- Logs detalhados para depuração

**Melhorias Implementadas:**

- Cache inteligente para reduzir chamadas à API
- Sistema de fallback robusto
- Validação de dados de resposta

#### Função: `getPrevisaoPorCodigo()`

```typescript
export async function getPrevisaoPorCodigo(
  codigo: string
): Promise<INMETPrevisaoCompleta | null>;
```

**Responsabilidades:**

- Busca previsão meteorológica para município específico
- Cache de 1 hora para dados atualizados
- **Sistema de normalização** para campos alternativos
- Múltiplos endpoints com fallback automático
- Sistema de retry com timeout

**Normalização de Campos Implementada:**

```typescript
// Normaliza campos que podem ter nomes diferentes na API
const normalizeWeatherData = (data: any): INMETPeriodo => {
  return {
    ...data,
    // Normalização para Índice UV
    indice_uv: data.indice_uv || data.uv || undefined,
    // Normalização para Velocidade do Vento
    vento_int:
      data.vento_int ||
      data.wind_speed ||
      data.velocidade_vento ||
      data.vento_int,
    // Normalização para outros campos conforme necessário
  };
};
```

**Endpoints Tentados (em ordem de prioridade):**

1. `/previsao/diaria/municipio/{codigo}`
2. `/previsao/{codigo}`
3. `/forecast/{codigo}`
4. Fallback para dados mock (desenvolvimento)

**Tratamento de Erros Avançado:**

- Logs detalhados de cada tentativa de endpoint
- Timeout automático (10s por endpoint)
- Fallback gracioso entre diferentes APIs
- Debug logging para troubleshooting em produção

#### Função: `buscarMunicipioPorCoordenadas()`

```typescript
export async function buscarMunicipioPorCoordenadas(
  lat: number,
  lng: number
): Promise<INMETMunicipio | null>;
```

**Responsabilidades:**

- Encontra o município mais próximo de coordenadas específicas
- Usado pelo mapa interativo para seleção por clique
- Cálculo de distância geográfica preciso
- Otimização para performance com grandes datasets

**Algoritmo Implementado:**

- Cálculo de distância haversine entre coordenadas
- Busca linear otimizada com early return
- Tratamento de edge cases (oceano, fronteiras)

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

  // Campos opcionais (NOVOS CAMPOS ADICIONADOS)
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

**Uso:** Representa a previsão completa de um dia (3 períodos)

#### Interface: `INMETPrevisaoCompleta`

```typescript
export interface INMETPrevisaoCompleta {
  [geocode: string]: {
    [data: string]: INMETPrevisaoDia;
  };
}
```

**Uso:** Estrutura completa da resposta da API com dados organizados por município e data

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone <url-do-repositorio>
   cd inmet-weather-app
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

4. **Abra no navegador:**
   ```
   http://localhost:3000
   ```

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de linting

## ✨ Funcionalidades

### 🔍 Busca de Municípios

- **Busca textual** por nome do município
- **Filtragem em tempo real** conforme digitação
- **Sugestões automáticas** baseadas nos dados do INMET
- **Normalização de strings** para melhor compatibilidade

### 🗺️ Mapa Interativo

- **OpenStreetMap** integrado com Leaflet
- **Clique em qualquer ponto** do mapa brasileiro
- **Identificação automática** do município mais próximo
- **Popup informativo** com botão de navegação
- **Renderização otimizada** apenas no cliente

### 📊 Dados Meteorológicos Completos

- **Todos os campos** disponibilizados pela API do INMET
- **Previsão para 7 dias** dividida em períodos (manhã/tarde/noite)
- **Informações detalhadas:** temperatura, vento, umidade, pressão, UV, etc.
- **Ícones meteorológicos** oficiais do INMET
- **Informações astronômicas** (nascer/pôr do sol, lua)

### 🛡️ Robustez e Performance

- **Cache inteligente** para otimizar chamadas à API
- **Sistema de fallback** entre múltiplos endpoints
- **Tratamento de erros** com mensagens informativas
- **Loading states** para melhor UX
- **Responsividade** completa em todos os dispositivos

### 🔧 Recursos Técnicos

- **TypeScript** completo com tipagem rigorosa
- **Next.js 14** com App Router
- **Tailwind CSS** para estilização
- **JSDoc** completo para documentação
- **Componentização** modular e reutilizável

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ usando dados oficiais do INMET**
