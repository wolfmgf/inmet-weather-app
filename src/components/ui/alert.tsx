/**
 * @fileoverview Componentes Alert para exibir mensagens importantes
 * Baseado no sistema de design shadcn/ui
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Configuração de variantes CSS para o componente Alert
 * Define estilos base e variações para diferentes tipos de alerta
 */
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        /** Alerta padrão com cores neutras */
        default: "bg-background text-foreground",
        /** Alerta destrutivo para erros ou avisos críticos */
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Componente Alert - container principal para mensagens de alerta
 * 
 * @component
 * @example
 * ```tsx
 * // Alerta básico
 * <Alert>
 *   <AlertTitle>Atenção</AlertTitle>
 *   <AlertDescription>
 *     Esta é uma mensagem importante.
 *   </AlertDescription>
 * </Alert>
 * 
 * // Alerta destrutivo com ícone
 * <Alert variant="destructive">
 *   <AlertTriangle className="h-4 w-4" />
 *   <AlertTitle>Erro</AlertTitle>
 *   <AlertDescription>
 *     Ocorreu um erro ao processar sua solicitação.
 *   </AlertDescription>
 * </Alert>
 * ```
 * 
 * @param className - Classes CSS adicionais
 * @param variant - Variante visual do alerta (default, destructive)
 * @param props - Demais props de HTMLDivElement
 * @param ref - Ref para o elemento div
 * @returns Elemento div com estilos de alerta e role="alert"
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

/**
 * Componente AlertTitle - título do alerta
 * 
 * @component
 * @param className - Classes CSS adicionais
 * @param props - Demais props de HTMLHeadingElement
 * @param ref - Ref para o elemento h5
 * @returns Elemento h5 com estilos de título
 */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

/**
 * Componente AlertDescription - descrição/conteúdo do alerta
 * 
 * @component
 * @param className - Classes CSS adicionais
 * @param props - Demais props de HTMLParagraphElement
 * @param ref - Ref para o elemento div
 * @returns Elemento div com estilos de descrição
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
