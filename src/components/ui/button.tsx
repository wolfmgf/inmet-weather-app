/**
 * @fileoverview Componente Button reutilizável com múltiplas variantes e tamanhos
 * Baseado no sistema de design shadcn/ui e construído com Radix UI
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Configuração de variantes CSS para o componente Button usando class-variance-authority (CVA)
 * Define estilos base e variações para diferentes tipos e tamanhos de botão
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Botão padrão com cor primária */
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        /** Botão destrutivo para ações perigosas */
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        /** Botão com contorno apenas */
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        /** Botão secundário com cor mais suave */
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        /** Botão fantasma sem fundo */
        ghost: "hover:bg-accent hover:text-accent-foreground",
        /** Botão estilo link */
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        /** Tamanho padrão */
        default: "h-9 px-4 py-2",
        /** Tamanho pequeno */
        sm: "h-8 rounded-md px-3 text-xs",
        /** Tamanho grande */
        lg: "h-10 rounded-md px-8",
        /** Tamanho para ícones quadrados */
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Props do componente Button
 * Extends HTMLButtonElement attributes and includes variant props
 * 
 * @interface ButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 * @extends VariantProps<typeof buttonVariants>
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  /** Se true, renderiza o componente como um slot Radix UI ao invés de um button nativo */
  asChild?: boolean
}

/**
 * Componente Button reutilizável com múltiplas variantes e tamanhos
 * 
 * @component
 * @example
 * ```tsx
 * // Botão padrão
 * <Button>Clique aqui</Button>
 * 
 * // Botão destrutivo
 * <Button variant="destructive">Deletar</Button>
 * 
 * // Botão grande com ícone
 * <Button size="lg">
 *   <Search className="mr-2 h-4 w-4" />
 *   Buscar
 * </Button>
 * 
 * // Como slot para outros componentes
 * <Button asChild>
 *   <Link href="/dashboard">Dashboard</Link>
 * </Button>
 * ```
 * 
 * @param className - Classes CSS adicionais
 * @param variant - Variante visual do botão (default, destructive, outline, secondary, ghost, link)
 * @param size - Tamanho do botão (default, sm, lg, icon)
 * @param asChild - Se true, renderiza como slot Radix UI
 * @param props - Demais props de HTMLButtonElement
 * @param ref - Ref para o elemento button
 * @returns Componente Button renderizado
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
