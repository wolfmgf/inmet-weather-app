// app/page.tsx
import CitySearchForm from "@/components/CitySearchForm";

export default function HomePage() {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="mb-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400">
          Previsão do Tempo INMET
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Dados oficiais e detalhados do Instituto Nacional de Meteorologia.
        </p>
      </div>
      <CitySearchForm />
    </main>
  );
}