# 📄 Documentação das Páginas

## 🏠 Página Inicial (`src/app/page.tsx`)

### Responsabilidades

- **Ponto de entrada** da aplicação
- **Busca e listagem** de municípios
- **Interface de seleção** de cidade
- **Navegação** para página de previsão

### Funcionalidades

```typescript
export default async function Home() {
  // Busca automática de municípios no carregamento
  const municipios = await getTodosMunicipios();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          🌦️ Previsão do Tempo INMET
        </h1>

        <p className="text-center text-muted-foreground mb-8">
          Dados meteorológicos oficiais do Instituto Nacional de Meteorologia
        </p>

        {/* Formulário de busca integrado */}
        <CitySearchForm
          municipios={municipios}
          onCitySelect={handleCitySelect}
        />
      </div>
    </main>
  );
}
```

### Estados Gerenciados

- **Lista de municípios**: Carregada do INMET
- **Cidade selecionada**: Estado local para navegação
- **Loading states**: Durante buscas e navegação

---

## 🌦️ Página de Previsão (`src/app/previsao/page.tsx`)

### Responsabilidades

- **Exibição detalhada** da previsão meteorológica
- **Renderização responsiva** de dados do INMET
- **Gerenciamento de estados** de loading e erro
- **Interface completa** com todas as informações meteorológicas

### Parâmetros de URL

```typescript
interface PrevisaoPageProps {
  searchParams: {
    codigo?: string; // Geocode do município
    nome?: string; // Nome da cidade (para display)
    uf?: string; // Estado (para display)
  };
}
```

### Funcionalidades Principais

```typescript
export default async function PrevisaoPage({
  searchParams,
}: PrevisaoPageProps) {
  // Validação de parâmetros
  if (!searchParams.codigo) {
    return <ErrorState message="Código da cidade não fornecido" />;
  }

  // Busca de dados
  const [municipios, previsao] = await Promise.all([
    getTodosMunicipios(),
    getPrevisaoPorCodigo(searchParams.codigo),
  ]);

  // Validação de dados
  const cidade = municipios.find(
    (m) => m.geocode.toString() === searchParams.codigo
  );

  if (!cidade || !previsao) {
    return <ErrorState message="Dados não encontrados" />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Navegação de volta */}
      <BackButton />

      {/* Componente principal de exibição */}
      <ForecastDisplay previsao={previsao} cidade={cidade} />
    </main>
  );
}
```

### Estados Tratados

- ✅ **Sucesso**: Dados carregados e exibidos
- ❌ **Erro**: Parâmetros inválidos ou dados indisponíveis
- 🔄 **Loading**: Estados de carregamento automáticos (Suspense)
- 🔄 **Fallback**: Dados mock quando API indisponível

---

## 🐛 Página de Debug (`src/app/debug/page.tsx`)

### Responsabilidades

- **Diagnóstico técnico** da aplicação
- **Logs detalhados** das chamadas de API
- **Informações de cache** e performance
- **Dados de desenvolvimento** e troubleshooting

### Funcionalidades de Debug

```typescript
export default async function DebugPage() {
  // Coleta de informações de diagnóstico
  const debugInfo = await coletarInformacoesDebug();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🐛 Debug - Sistema INMET</h1>

      {/* Status das APIs */}
      <DebugSection title="Status das APIs">
        <ApiStatusCheck />
      </DebugSection>

      {/* Cache Information */}
      <DebugSection title="Informações de Cache">
        <CacheInfo />
      </DebugSection>

      {/* Logs recentes */}
      <DebugSection title="Logs Recentes">
        <RecentLogs />
      </DebugSection>

      {/* Teste de endpoints */}
      <DebugSection title="Teste de Endpoints">
        <EndpointTester />
      </DebugSection>
    </main>
  );
}
```

### Informações Fornecidas

- 🌐 **Status da API INMET**
- 📊 **Estatísticas de cache**
- 📝 **Logs de erro e sucesso**
- 🔧 **Configurações ativas**
- 📱 **Informações do ambiente**

---

## 🎨 Layout Raiz (`src/app/layout.tsx`)

### Responsabilidades

- **Estrutura HTML base** da aplicação
- **Configurações globais** (meta tags, fonts, etc.)
- **Providers** e contextos globais
- **Configuração de tema** claro/escuro

### Configurações Aplicadas

```typescript
export const metadata: Metadata = {
  title: "Previsão do Tempo INMET",
  description:
    "Dados meteorológicos oficiais do Instituto Nacional de Meteorologia",
  keywords: ["tempo", "previsão", "meteorologia", "INMET", "Brasil"],
  authors: [{ name: "Sistema INMET" }],
  creator: "Sistema de Previsão INMET",
  openGraph: {
    title: "Previsão do Tempo INMET",
    description:
      "Dados meteorológicos oficiais do Instituto Nacional de Meteorologia",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        {/* Provedor de tema */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Recursos Configurados

- 🌙 **Modo escuro automático**
- 🔤 **Fontes Geist (Sans e Mono)**
- 📱 **Viewport responsivo**
- 🎨 **Sistema de temas**
- 🔍 **SEO otimizado**
- 🌐 **Localização pt-BR**

---

## 📊 Fluxo de Navegação

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Página        │    │   Busca de       │    │   Página de     │
│   Inicial       │───▶│   Cidade         │───▶│   Previsão      │
│   (/)           │    │                  │    │   (/previsao)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐             │
         │              │   Seleção de     │             │
         │              │   Município      │             │
         │              └──────────────────┘             │
         │                                                │
         └────────────────────◀──────────────────────────┘
                            Botão Voltar
```

## 🔄 Estados da Aplicação

### Estados de Carregamento

- **Initial Loading**: Carregamento da lista de municípios
- **Search Loading**: Durante busca/filtragem de cidades
- **Navigation Loading**: Transição entre páginas
- **Data Loading**: Carregamento de dados de previsão

### Estados de Erro

- **Network Error**: Falha de conexão com API
- **Invalid Parameters**: Parâmetros de URL inválidos
- **Not Found**: Cidade ou dados não encontrados
- **Server Error**: Erro interno da API do INMET

### Estados de Sucesso

- **Data Loaded**: Dados carregados com sucesso
- **Cache Hit**: Dados servidos do cache
- **Fallback Active**: Dados mock em uso

## 📈 Performance e Cache

### Estratégias Implementadas

- **ISR (Incremental Static Regeneration)**: Para dados de municípios
- **SWR Pattern**: Para dados de previsão
- **Component Memoization**: Otimização de re-renders
- **Image Optimization**: Ícones do INMET otimizados
- **Code Splitting**: Carregamento sob demanda

### Tempos de Cache

```typescript
const CACHE_TIMES = {
  municipios: 24 * 60 * 60, // 24 horas
  previsao: 60 * 60, // 1 hora
  imagens: 7 * 24 * 60 * 60, // 7 dias
};
```

## 🛡️ Tratamento de Erros

### Boundary Components

- **Error Boundary**: Captura erros de React
- **Network Boundary**: Trata falhas de rede
- **Validation Boundary**: Valida parâmetros e dados

### Fallback Strategies

- **Graceful Degradation**: Funcionalidade reduzida em caso de erro
- **Mock Data**: Dados de demonstração
- **Retry Logic**: Tentativas automáticas de recuperação
- **User Feedback**: Mensagens claras de erro
