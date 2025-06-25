/**
 * @fileoverview Componentes Card reutilizáveis para exibir conteúdo estruturado
 * Baseado no sistema de design shadcn/ui
 * @author Equipe de Desenvolvimento
 * @version 1.0.0
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Componente principal Card - container base para conteúdo estruturado
 * 
 * @component
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Título do Card</CardTitle>
 *     <CardDescription>Descrição opcional</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Conteúdo principal do card
 *   </CardContent>
 *   <CardFooter>
 *     Ações ou informações adicionais
 *   </CardFooter>
 * </Card>
 * ```
 * 
 * @param className - Classes CSS adicionais
 * @param props - Demais props de HTMLDivElement
 * @param ref - Ref para o elemento div
 * @returns Elemento div com estilos de card
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
))
Card.displayName = "Card"

/**
 * Componente CardHeader - seção de cabeçalho do card
 * Geralmente contém CardTitle e CardDescription
 * 
 * @component
 * @param className - Classes CSS adicionais
 * @param props - Demais props de HTMLDivElement
 * @param ref - Ref para o elemento div
 * @returns Elemento div com estilos de header
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * Componente CardTitle - título principal do card
 * 
 * @component
 * @param className - Classes CSS adicionais
 * @param props - Demais props de HTMLDivElement
 * @param ref - Ref para o elemento div
 * @returns Elemento div com estilos de título
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * Componente CardDescription - descrição/subtítulo do card
 * 
 * @component
 * @param className - Classes CSS adicionais
 * @param props - Demais props de HTMLDivElement
 * @param ref - Ref para o elemento div
 * @returns Elemento div com estilos de descrição
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * Componente CardContent - conteúdo principal do card
 * 
 * @component
 * @param className - Classes CSS adicionais
 * @param props - Demais props de HTMLDivElement
 * @param ref - Ref para o elemento div
 * @returns Elemento div com estilos de conteúdo
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * Componente CardFooter - rodapé do card
 * Geralmente contém ações ou informações adicionais
 * 
 * @component
 * @param className - Classes CSS adicionais
 * @param props - Demais props de HTMLDivElement
 * @param ref - Ref para o elemento div
 * @returns Elemento div com estilos de rodapé
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
