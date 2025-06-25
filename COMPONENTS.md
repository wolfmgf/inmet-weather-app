# 🧩 Documentação dos Componentes

## 🔍 CitySearchForm.tsx

### Propósito

Componente de busca e seleção de cidades com funcionalidades avançadas de filtragem e autocompletar.

### Interface

```typescript
interface CitySearchFormProps {
  municipios: INMETMunicipio[]; // Lista completa de municípios
  onCitySelect: (cidade: INMETMunicipio) => void; // Callback de seleção
  isLoading?: boolean; // Estado de carregamento
}
```

### Funcionalidades

- ✅ **Busca em tempo real** com debounce
- ✅ **Filtragem inteligente** por nome e UF
- ✅ **Navegação por teclado** (↑↓ Enter Esc)
- ✅ **Highlight de resultados** com termo de busca
- ✅ **Estados de loading** e empty state
- ✅ **Acessibilidade completa** (ARIA labels, roles)

### Implementação

```typescript
export default function CitySearchForm({
  municipios,
  onCitySelect,
  isLoading = false,
}: CitySearchFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState<INMETMunicipio[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce da busca para performance
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filtragem reativa
  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      const filtered = buscarMunicipios(debouncedSearch, municipios);
      setFilteredCities(filtered);
      setIsOpen(true);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
  }, [debouncedSearch, municipios]);

  // Navegação por teclado
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredCities[selectedIndex]) {
          handleCitySelect(filteredCities[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Input de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Digite o nome da cidade ou UF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4"
          disabled={isLoading}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
      </div>

      {/* Lista de resultados */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto">
          <CardContent className="p-0">
            {filteredCities.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhuma cidade encontrada
              </div>
            ) : (
              <ul role="listbox" aria-label="Cidades encontradas">
                {filteredCities.map((cidade, index) => (
                  <li
                    key={cidade.geocode}
                    role="option"
                    aria-selected={index === selectedIndex}
                    className={cn(
                      "p-3 cursor-pointer border-b last:border-b-0 hover:bg-muted",
                      index === selectedIndex && "bg-muted"
                    )}
                    onClick={() => handleCitySelect(cidade)}
                  >
                    <div className="font-medium">
                      {highlightMatch(cidade.nome, searchTerm)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {cidade.sigla} • {cidade.geocode}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

## 🌦️ ForecastDisplay.tsx

### Propósito

Componente principal para exibição completa e organizada dos dados meteorológicos do INMET.

### Interface

```typescript
interface ForecastDisplayProps {
  previsao: INMETPrevisaoCompleta; // Dados completos da previsão
  cidade: INMETMunicipio; // Informações da cidade
}
```

### Arquitetura de Sub-componentes

```
ForecastDisplay
├── WeatherSummary (resumo destacado)
├── PeriodoCard[] (manhã, tarde, noite)
│   ├── DetailedWeatherInfo
│   ├── AstroInfo (apenas manhã)
│   └── DebugInfo (campos não mapeados)
├── DataCoverageInfo (análise de cobertura)
└── LegendCards (informações e legendas)
```

### DetailedWeatherInfo Sub-componente

```typescript
const DetailedWeatherInfo = ({ periodo }: { periodo: INMETPeriodo }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {/* Grid responsivo com cards para cada informação meteorológica */}

      {/* Pressão Atmosférica */}
      {periodo.pressao_atmosferica && (
        <MetricCard
          icon={Gauge}
          label="Pressão"
          value={`${periodo.pressao_atmosferica} hPa`}
          color="blue"
        />
      )}

      {/* Visibilidade */}
      {periodo.visibilidade && (
        <MetricCard
          icon={Eye}
          label="Visibilidade"
          value={`${periodo.visibilidade} km`}
          color="green"
        />
      )}

      {/* Índice UV */}
      {periodo.indice_uv && (
        <MetricCard
          icon={Sun}
          label="Índice UV"
          value={periodo.indice_uv}
          color="yellow"
          badge={getUVLevel(periodo.indice_uv)}
        />
      )}

      {/* ... outros 12 campos meteorológicos */}
    </div>
  );
};
```

### AstroInfo Sub-componente

```typescript
const AstroInfo = ({ periodo }: { periodo: INMETPeriodo }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
      {/* Nascer do Sol */}
      {periodo.nascer_sol && (
        <AstroItem
          icon={Sunrise}
          label="Nascer do Sol"
          value={periodo.nascer_sol}
          color="orange-500"
        />
      )}

      {/* Pôr do Sol */}
      {periodo.por_sol && (
        <AstroItem
          icon={Sunset}
          label="Pôr do Sol"
          value={periodo.por_sol}
          color="orange-600"
        />
      )}

      {/* Fase da Lua */}
      {periodo.fase_lua && (
        <AstroItem
          icon={Moon}
          label="Fase da Lua"
          value={periodo.fase_lua}
          color="yellow-400"
        />
      )}
    </div>
  );
};
```

### Sistema de Debug Automático

```typescript
// Detecta campos não mapeados automaticamente
{
  Object.keys(periodo).filter((key) => {
    const knownFields = [
      "entidade",
      "uf",
      "cidade",
      "dia_semana",
      "ico",
      "resumo",
      "temp_max",
      "temp_min",
      "umidade_max",
      "umidade_min",
      "vento_dir",
      "vento_int",
      "icone",
      "pressao_atmosferica",
      "visibilidade",
      "ponto_orvalho",
      "indice_uv",
      "radiacao_solar",
      "rajada_vento",
      "sensacao_termica_max",
      "sensacao_termica_min",
      "probabilidade_chuva",
      "volume_chuva",
      "nascer_sol",
      "por_sol",
      "fase_lua",
      "direcao_vento_graus",
      "cobertura_nuvens",
    ];
    return !knownFields.includes(key) && (periodo as any)[key];
  }).length > 0 && (
    <DebugAlert
      title="Campos adicionais detectados na API"
      fields={newFields}
    />
  );
}
```

---

## 📊 WeatherSummary.tsx

### Propósito

Exibe um resumo destacado das condições meteorológicas atuais com alertas importantes.

### Interface

```typescript
interface WeatherSummaryProps {
  periodo: INMETPeriodo; // Dados do período a destacar
  nomePeriodo: string; // Nome para exibição (ex: "Condições Atuais")
}
```

### Funcionalidades

- 🎨 **Visual destacado** com gradientes
- ⚠️ **Sistema de alertas** para condições importantes
- 📊 **Métricas principais** em cards organizados
- 🎯 **Classificação automática** de índices (UV, etc.)

### Sistema de Alertas

```typescript
const getAlerts = (periodo: INMETPeriodo) => {
  const alerts = [];

  // Alerta UV Alto
  if (periodo.indice_uv && parseInt(periodo.indice_uv) > 7) {
    alerts.push({
      type: "warning",
      icon: Sun,
      title: "Índice UV Alto",
      message: `${periodo.indice_uv} - Use proteção solar`,
      color: "orange",
    });
  }

  // Alerta Chuva
  if (
    periodo.probabilidade_chuva &&
    parseInt(periodo.probabilidade_chuva) > 60
  ) {
    alerts.push({
      type: "info",
      icon: CloudRain,
      title: "Possibilidade de Chuva",
      message: `${periodo.probabilidade_chuva}% de chance`,
      color: "blue",
    });
  }

  // Alerta Vento Forte
  if (periodo.rajada_vento && parseInt(periodo.rajada_vento) > 40) {
    alerts.push({
      type: "caution",
      icon: Wind,
      title: "Rajadas de Vento",
      message: `Até ${periodo.rajada_vento} km/h`,
      color: "amber",
    });
  }

  return alerts;
};
```

---

## 📈 DataCoverageInfo.tsx

### Propósito

Analisa e exibe informações sobre a cobertura de dados da API do INMET em tempo real.

### Interface

```typescript
interface DataCoverageInfoProps {
  periodo: INMETPeriodo; // Dados a serem analisados
  showDetails?: boolean; // Exibir análise detalhada
}
```

### Análise Automática

```typescript
const analyzeDataCoverage = (periodo: INMETPeriodo) => {
  const allFields = [
    // Lista completa de 28 campos possíveis
    { key: "entidade", label: "Entidade", required: true },
    { key: "uf", label: "UF", required: true },
    { key: "cidade", label: "Cidade", required: true },
    // ... todos os outros campos
  ];

  const fieldsWithData = allFields.filter((field) => {
    const value = (periodo as any)[field.key];
    return (
      value !== undefined && value !== null && value !== "" && value !== "0"
    );
  });

  const requiredFieldsWithData = fieldsWithData.filter((f) => f.required);
  const optionalFieldsWithData = fieldsWithData.filter((f) => !f.required);

  const coveragePercentage = Math.round(
    (fieldsWithData.length / allFields.length) * 100
  );

  return {
    total: allFields.length,
    available: fieldsWithData.length,
    required: requiredFieldsWithData.length,
    optional: optionalFieldsWithData.length,
    percentage: coveragePercentage,
    missing: allFields.filter((f) => !fieldsWithData.includes(f)),
  };
};
```

---

## 🎨 Componentes UI Base

### Card.tsx

```typescript
/**
 * Componente Card base usando Radix UI primitives
 * Fornece estrutura consistente para conteúdo agrupado
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
));
```

### Button.tsx

```typescript
/**
 * Sistema de botões com variantes e tamanhos
 */
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

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Input.tsx

```typescript
/**
 * Componente Input estilizado com estados
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

---

## 🔧 Hooks Personalizados

### useDebounce

```typescript
/**
 * Hook para debounce de valores, otimizando performance em buscas
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### useLocalStorage

```typescript
/**
 * Hook para persistência no localStorage com SSR safety
 */
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

---

## ♿ Acessibilidade

### Recursos Implementados

- **ARIA Labels**: Todos os componentes têm labels descritivos
- **Keyboard Navigation**: Suporte completo a navegação por teclado
- **Focus Management**: Foco visível e lógico
- **Screen Reader Support**: Compatibilidade com leitores de tela
- **Contrast Ratios**: Cores com contraste adequado
- **Semantic HTML**: Uso correto de elementos semânticos

### Exemplo de Implementação

```typescript
// CitySearchForm - Acessibilidade completa
<Input
  type="text"
  placeholder="Digite o nome da cidade ou UF..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onKeyDown={handleKeyDown}
  className="pl-10 pr-4"
  disabled={isLoading}
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-autocomplete="list"
  aria-describedby="search-help"
  role="combobox"
/>

<ul
  role="listbox"
  aria-label="Cidades encontradas"
  aria-live="polite"
>
  {filteredCities.map((cidade, index) => (
    <li
      key={cidade.geocode}
      role="option"
      aria-selected={index === selectedIndex}
      aria-describedby={`city-${cidade.geocode}`}
    >
      {/* Conteúdo da cidade */}
    </li>
  ))}
</ul>
```

## 🎨 Sistema de Design

### Cores e Temas

```css
:root {
  --background: 0 0% 100%;
  --foreground: 20 14.3% 4.1%;
  --primary: 24 9.8% 10%;
  --primary-foreground: 60 9.1% 97.8%;
  --muted: 60 4.8% 95.9%;
  --muted-foreground: 25 5.3% 44.7%;
  /* ... todas as variáveis de cor */
}

.dark {
  --background: 20 14.3% 4.1%;
  --foreground: 60 9.1% 97.8%;
  --primary: 60 9.1% 97.8%;
  --primary-foreground: 24 9.8% 10%;
  /* ... versões escuras */
}
```

### Grid System

```typescript
// Layout responsivo padrão
const gridClasses = {
  mobile: "grid-cols-1",
  tablet: "md:grid-cols-2",
  desktop: "lg:grid-cols-3",
  wide: "xl:grid-cols-4",
};

// Spacing consistente
const spacing = {
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};
```
