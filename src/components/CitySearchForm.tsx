// components/CitySearchForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function CitySearchForm() {
  const [city, setCity] = useState('');
  const router = useRouter();

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