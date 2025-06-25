# 🌐 Documentação da API e Arquitetura

## 📡 Integração com API do INMET

### URLs Base

```typescript
const API_ENDPOINTS = {
  base: "https://apiprevmet3.inmet.gov.br",
  portal: "https://portal.inmet.gov.br",
  images: "https://portal.inmet.gov.br/img/tempo",
};
```

### Endpoints Disponíveis

#### 1. Lista de Municípios

```http
GET https://apiprevmet3.inmet.gov.br/municipios
```

**Resposta:**

```json
[
  {
    "geocode": 3550308,
    "nome": "São Paulo",
    "sigla": "SP",
    "longitude": "-46.6333",
    "latitude": "-23.5500"
  }
  // ... ~5570 municípios
]
```

**Características:**

- ✅ Cache: 24 horas
- ✅ Dados estáveis (mudanças raras)
- ✅ Sem autenticação necessária
- ⚡ Response time: ~500ms

#### 2. Previsão Meteorológica (Múltiplos Endpoints)

**Ordem de Tentativa:**

1. `GET /previsao/diaria/municipio/{geocode}` (preferencial)
2. `GET /previsao/{geocode}` (fallback 1)
3. `GET /forecast/{geocode}` (fallback 2)

**Exemplo de Resposta:**

```json
{
  "3550308": {
    "2024-01-15": {
      "manha": {
        "entidade": "INMET",
        "uf": "SP",
        "cidade": "São Paulo",
        "dia_semana": "Segunda-feira",
        "ico": "ps",
        "resumo": "Sol entre nuvens",
        "temp_max": "28",
        "temp_min": "19",
        "umidade_max": "85",
        "umidade_min": "55",
        "vento_dir": "NE",
        "vento_int": "15",
        "icone": "https://portal.inmet.gov.br/img/tempo/ps.png",
        "pressao_atmosferica": "1013.2",
        "visibilidade": "10",
        "ponto_orvalho": "16",
        "indice_uv": "8",
        "radiacao_solar": "850",
        "rajada_vento": "25",
        "sensacao_termica_max": "30",
        "sensacao_termica_min": "17",
        "probabilidade_chuva": "20",
        "volume_chuva": "0.5",
        "nascer_sol": "05:45",
        "por_sol": "19:30",
        "fase_lua": "Crescente",
        "direcao_vento_graus": "45",
        "cobertura_nuvens": "40"
      },
      "tarde": {
        /* dados similares */
      },
      "noite": {
        /* dados similares */
      }
    },
    "2024-01-16": {
      /* próximo dia */
    }
  }
}
```

**Características:**

- ✅ Cache: 1 hora
- ✅ Dados atualizados regularmente
- ✅ Até 7 dias de previsão
- ⚡ Response time: ~800ms
- 🔄 Sistema de retry automático

#### 3. Ícones Meteorológicos

```http
GET https://portal.inmet.gov.br/img/tempo/{codigo}.png
```

**Códigos de Ícones:**

```typescript
const ICON_CODES = {
  ps: "Parcialmente nublado (sol)",
  pn: "Parcialmente nublado",
  c: "Chuva",
  ec: "Encoberto",
  cl: "Céu claro",
  pc: "Pouco nublado",
  ct: "Chuva com trovoada",
  pp: "Possibilidade de pancadas",
  cm: "Chuva moderada",
  cf: "Chuva forte",
  n: "Neblina",
  g: "Garoa",
  // ... outros códigos
};
```

---

## 🏗️ Arquitetura da Aplicação

### Estrutura em Camadas

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│   (Pages, Components, UI)          │
├─────────────────────────────────────┤
│           Business Layer            │
│   (Hooks, Utils, Validation)       │
├─────────────────────────────────────┤
│            Service Layer            │
│   (API Calls, Cache, Fallbacks)    │
├─────────────────────────────────────┤
│             Data Layer              │
│   (Types, Interfaces, Models)      │
└─────────────────────────────────────┘
```

### Fluxo de Dados

```typescript
// 1. User Action (busca cidade)
const handleCitySearch = (term: string) => {
  // 2. Business Logic (filtragem)
  const filtered = buscarMunicipios(term, municipios);

  // 3. State Update
  setFilteredCities(filtered);

  // 4. UI Re-render
  return <CityList cities={filtered} />;
};

// 5. City Selection
const handleCitySelect = (cidade: INMETMunicipio) => {
  // 6. Navigation with Data
  router.push(
    `/previsao?codigo=${cidade.geocode}&nome=${cidade.nome}&uf=${cidade.sigla}`
  );
};

// 7. Server-Side Data Fetching
export default async function PrevisaoPage({ searchParams }) {
  // 8. Service Layer Call
  const previsao = await getPrevisaoPorCodigo(searchParams.codigo);

  // 9. Component Rendering
  return <ForecastDisplay previsao={previsao} cidade={cidade} />;
}
```

---

## 🔄 Sistema de Cache

### Estratégias por Tipo de Dado

#### Cache de Municípios (ISR)

```typescript
// Next.js ISR configuration
export async function getTodosMunicipios() {
  const response = await fetch(`${API_BASE_URL}/municipios`, {
    next: {
      revalidate: 86400, // 24 horas
      tags: ["municipios"], // Cache tagging
    },
  });

  return response.json();
}

// Manual revalidation trigger
export async function revalidateMunicipios() {
  revalidateTag("municipios");
}
```

#### Cache de Previsões (SWR Pattern)

```typescript
export async function getPrevisaoPorCodigo(codigo: string) {
  const response = await fetch(`${API_BASE_URL}/previsao/${codigo}`, {
    next: {
      revalidate: 3600, // 1 hora
      tags: [`previsao-${codigo}`],
    },
  });

  return response.json();
}
```

#### Cache de Browser (Imagens)

```typescript
// Automatic browser caching for images
const ImageWithCache = ({ src, alt }) => (
  <Image
    src={src}
    alt={alt}
    width={80}
    height={80}
    unoptimized={false} // Enable Next.js optimization
    priority={false} // Lazy loading
    quality={85} // Optimal quality/size ratio
  />
);
```

### Cache Invalidation

```typescript
// Cache invalidation strategies
const CACHE_STRATEGIES = {
  // Time-based (TTL)
  municipios: {
    ttl: 24 * 60 * 60, // 24 hours
    staleWhileRevalidate: true,
  },

  // Frequency-based
  previsoes: {
    ttl: 60 * 60, // 1 hour
    maxAge: 2 * 60 * 60, // 2 hours max
    staleWhileRevalidate: true,
  },

  // Event-based
  images: {
    ttl: 7 * 24 * 60 * 60, // 7 days
    immutable: true,
  },
};
```

---

## 🛡️ Sistema de Fallbacks

### Hierarquia de Fallbacks

```typescript
// 1. Primary API
async function fetchFromPrimary(codigo: string) {
  try {
    const response = await fetch(`/previsao/diaria/municipio/${codigo}`);
    if (response.ok) return await response.json();
    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.log("Primary API failed:", error);
    throw error;
  }
}

// 2. Secondary APIs
async function fetchFromSecondary(codigo: string) {
  const endpoints = [`/previsao/${codigo}`, `/forecast/${codigo}`];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) return await response.json();
    } catch (error) {
      console.log(`Secondary endpoint ${endpoint} failed:`, error);
      continue;
    }
  }
  throw new Error("All secondary endpoints failed");
}

// 3. Mock Data
function getMockData(codigo: string) {
  console.log("Using mock data for:", codigo);
  return generateMockPrevisao(codigo);
}

// 4. Orchestrated Fallback
export async function getPrevisaoPorCodigo(codigo: string) {
  try {
    return await fetchFromPrimary(codigo);
  } catch {
    try {
      return await fetchFromSecondary(codigo);
    } catch {
      return getMockData(codigo);
    }
  }
}
```

### Circuit Breaker Pattern

```typescript
class APICircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";

  constructor(
    private threshold = 5, // Max failures
    private timeout = 60000 // 1 minute timeout
  ) {}

  async call<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime < this.timeout) {
        throw new Error("Circuit breaker is OPEN");
      }
      this.state = "HALF_OPEN";
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = "OPEN";
    }
  }
}
```

---

## 📊 Monitoramento e Logging

### Sistema de Logs

```typescript
// Centralized logging system
class Logger {
  private static instance: Logger;

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string, data?: any) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  }

  warn(message: string, data?: any) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
  }

  error(message: string, error?: any) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);

    // Send to monitoring service (if configured)
    this.sendToMonitoring("error", message, error);
  }

  private sendToMonitoring(level: string, message: string, data?: any) {
    // Implementation for external monitoring
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: message,
        fatal: level === "error",
      });
    }
  }
}

// Usage throughout the application
const logger = Logger.getInstance();

export async function getPrevisaoPorCodigo(codigo: string) {
  logger.info(`Fetching weather data for city: ${codigo}`);

  try {
    const data = await fetchWeatherData(codigo);
    logger.info(`Successfully fetched weather data for: ${codigo}`, {
      dataSize: JSON.stringify(data).length,
    });
    return data;
  } catch (error) {
    logger.error(`Failed to fetch weather data for: ${codigo}`, error);
    throw error;
  }
}
```

### Performance Monitoring

```typescript
// Performance metrics collection
class PerformanceMonitor {
  static startTimer(name: string) {
    performance.mark(`${name}-start`);
  }

  static endTimer(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name)[0];
    console.log(`[PERF] ${name}: ${measure.duration.toFixed(2)}ms`);

    // Clean up
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);

    return measure.duration;
  }
}

// Usage example
PerformanceMonitor.startTimer("api-municipios");
const municipios = await getTodosMunicipios();
PerformanceMonitor.endTimer("api-municipios");
```

---

## 🔐 Segurança

### Validação de Dados

```typescript
// Input validation schemas
const schemas = {
  geocode: z.string().regex(/^\d{7}$/, "Geocode deve ter 7 dígitos"),
  searchTerm: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Apenas letras e espaços"),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
};

// Validation middleware
function validateInput<T>(schema: ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    logger.error("Input validation failed", error);
    throw new Error("Dados inválidos fornecidos");
  }
}

// Usage
export function buscarMunicipios(termo: string, municipios: INMETMunicipio[]) {
  const validTerm = validateInput(schemas.searchTerm, termo);
  // ... rest of function
}
```

### Headers de Segurança

```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

### Rate Limiting (Client-side)

```typescript
class RateLimiter {
  private requests: number[] = [];

  constructor(
    private maxRequests = 10,
    private windowMs = 60000 // 1 minute
  ) {}

  canMakeRequest(): boolean {
    const now = Date.now();

    // Remove old requests outside window
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    // Check if under limit
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  getResetTime(): number {
    if (this.requests.length === 0) return 0;

    const oldestRequest = Math.min(...this.requests);
    return oldestRequest + this.windowMs;
  }
}

// Usage
const apiLimiter = new RateLimiter(10, 60000); // 10 requests per minute

export async function makeAPICall(url: string) {
  if (!apiLimiter.canMakeRequest()) {
    const resetTime = apiLimiter.getResetTime();
    throw new Error(`Rate limit exceeded. Reset at ${new Date(resetTime)}`);
  }

  return fetch(url);
}
```

---

## 📈 Otimizações de Performance

### Bundle Analysis

```json
// package.json scripts for analysis
{
  "scripts": {
    "analyze": "cross-env ANALYZE=true next build",
    "analyze:server": "cross-env BUNDLE_ANALYZE=server next build",
    "analyze:browser": "cross-env BUNDLE_ANALYZE=browser next build"
  }
}
```

### Code Splitting

```typescript
// Dynamic imports for large components
const ForecastDisplay = dynamic(() => import("@/components/ForecastDisplay"), {
  loading: () => <ForecastSkeleton />,
  ssr: false, // Client-side only if needed
});

const DataCoverageInfo = dynamic(
  () => import("@/components/DataCoverageInfo"),
  {
    loading: () => <div>Carregando análise...</div>,
  }
);

// Route-level splitting (automatic with Next.js App Router)
// Each page.tsx creates a separate chunk
```

### Image Optimization

```typescript
// Optimized image loading
const WeatherIcon = ({ icone, resumo }: { icone: string; resumo: string }) => (
  <Image
    src={icone}
    alt={resumo}
    width={80}
    height={80}
    priority={false} // Lazy load
    quality={85} // Optimal quality
    placeholder="blur" // Blur placeholder
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." // Base64 blur
    sizes="(max-width: 768px) 60px, 80px" // Responsive sizes
  />
);
```

### Database/API Optimization

```typescript
// Optimized data fetching
export async function getOptimizedPrevisao(codigo: string) {
  // Parallel fetching when possible
  const [municipios, previsao] = await Promise.all([
    getTodosMunicipios(),
    getPrevisaoPorCodigo(codigo),
  ]);

  // Early return if data not found
  if (!previsao) return null;

  // Minimal data transformation
  const cidade = municipios.find((m) => m.geocode.toString() === codigo);

  return { previsao, cidade };
}
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// Service layer tests
describe("INMET Service", () => {
  describe("getTodosMunicipios", () => {
    it("should fetch and return municipalities", async () => {
      const mockData = [
        {
          geocode: 3550308,
          nome: "São Paulo",
          sigla: "SP",
          longitude: "-46.6333",
          latitude: "-23.5500",
        },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await getTodosMunicipios();

      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        "https://apiprevmet3.inmet.gov.br/municipios",
        expect.objectContaining({
          next: { revalidate: 86400 },
        })
      );
    });

    it("should fallback to mock data on API failure", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      const result = await getTodosMunicipios();

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("geocode");
    });
  });
});
```

### Integration Tests

```typescript
// Component integration tests
describe("ForecastDisplay Integration", () => {
  it("should display weather data correctly", () => {
    const mockPrevisao = {
      "3550308": {
        "2024-01-15": {
          manha: {
            entidade: "INMET",
            temp_max: "25",
            temp_min: "18",
            resumo: "Sol entre nuvens",
            // ... other fields
          },
        },
      },
    };

    const mockCidade = {
      geocode: 3550308,
      nome: "São Paulo",
      sigla: "SP",
      longitude: "-46.6333",
      latitude: "-23.5500",
    };

    render(<ForecastDisplay previsao={mockPrevisao} cidade={mockCidade} />);

    expect(screen.getByText("São Paulo - SP")).toBeInTheDocument();
    expect(screen.getByText("Sol entre nuvens")).toBeInTheDocument();
    expect(screen.getByText("18°C - 25°C")).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

```typescript
// End-to-end workflow tests
test("complete weather forecast flow", async ({ page }) => {
  await page.goto("/");

  // Search for a city
  await page.fill('[placeholder*="Digite o nome da cidade"]', "São Paulo");
  await page.waitForSelector('[role="listbox"]');

  // Select first result
  await page.click('[role="option"]:first-child');

  // Wait for navigation and data loading
  await page.waitForURL(/\/previsao/);
  await page.waitForSelector("text=Previsão para São Paulo");

  // Verify forecast data is displayed
  await expect(page.locator("text=Manhã")).toBeVisible();
  await expect(page.locator("text=Tarde")).toBeVisible();
  await expect(page.locator("text=Noite")).toBeVisible();

  // Check that weather metrics are shown
  await expect(page.locator("text=Pressão")).toBeVisible();
  await expect(page.locator("text=Visibilidade")).toBeVisible();
  await expect(page.locator("text=Índice UV")).toBeVisible();
});
```

Este documento completa a documentação técnica abrangente de toda a aplicação INMET Weather App, cobrindo desde a integração com APIs até estratégias de teste e otimização.
