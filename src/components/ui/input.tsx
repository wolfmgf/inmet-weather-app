/**
 * @fileoverview Componente Input reutilizável para formulários
 * Baseado no sistema de design shadcn/ui
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Componente Input estilizado para formulários
 * 
 * @component
 * @example
 * ```tsx
 * // Input básico
 * <Input type="text" placeholder="Digite seu nome" />
 * 
 * // Input controlado
 * <Input
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   placeholder="seu@email.com"
 * />
 * 
 * // Input com classe customizada
 * <Input
 *   type="password"
 *   className="border-red-500"
 *   placeholder="Senha"
 * />
 * ```
 * 
 * @param className - Classes CSS adicionais
 * @param type - Tipo do input HTML (text, email, password, etc.)
 * @param props - Demais props de HTMLInputElement
 * @param ref - Ref para o elemento input
 * @returns Elemento input estilizado
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
