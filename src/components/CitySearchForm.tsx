/**
 * @fileoverview Componente de formulário para busca de cidades brasileiras
 * Permite ao usuário pesquisar previsão do tempo por nome do município
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

// components/CitySearchForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

/**
 * Componente de formulário para busca de cidades brasileiras
 * Redireciona para a página de previsão com o parâmetro de cidade
 * 
 * @component
 * @example
 * ```tsx
 * <CitySearchForm />
 * ```
 * 
 * @returns Formulário de busca de cidade com input e botão de submit
 */
export default function CitySearchForm() {
  const [city, setCity] = useState('');
  const router = useRouter();

  /**
   * Manipula o envio do formulário
   * Valida se há texto inserido e navega para a página de previsão
   * 
   * @param e - Evento de submit do formulário
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      // Navega para a página de previsão com o nome da cidade como parâmetro de busca
      router.push(`/previsao?cidade=${encodeURIComponent(city.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg items-center space-x-2">
      <Input
        type="text"
        placeholder="Digite o nome de um município brasileiro..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="text-lg p-6"
      />
      <Button type="submit" size="lg" className="p-6">
        <Search className="h-6 w-6" />
      </Button>
    </form>
  );
}