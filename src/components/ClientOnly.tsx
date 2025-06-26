'use client';

import { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente que renderiza conteúdo apenas no cliente
 * Evita erros de hidratação do Next.js
 * 
 * @param children - Conteúdo a ser renderizado apenas no cliente
 * @param fallback - Conteúdo a ser exibido durante o carregamento (opcional)
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
