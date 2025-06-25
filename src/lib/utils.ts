/**
 * @fileoverview Utilitários gerais da aplicação
 *
 * Este arquivo contém funções auxiliares e utilitários utilizados
 * em toda a aplicação, incluindo manipulação de classes CSS,
 * formatação de dados e outras funcionalidades de suporte.
 *
 * @author Sistema de Previsão INMET
 * @version 1.0.0
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina e mescla classes CSS de forma inteligente
 *
 * @description Esta função utiliza `clsx` para combinar classes condicionalmente
 * e `tailwind-merge` para resolver conflitos entre classes do Tailwind CSS.
 * É especialmente útil para componentes que precisam aceitar classes personalizadas
 * sem sobrescrever as classes base.
 *
 * @param {...ClassValue[]} inputs - Array de classes CSS, objetos condicionais ou strings
 *
 * @returns {string} String de classes CSS otimizada e sem conflitos
 *
 * @example
 * ```typescript
 * // Básico
 * cn("px-2 py-1", "bg-blue-500") // "px-2 py-1 bg-blue-500"
 *
 * // Com condicionais
 * cn("px-2 py-1", {
 *   "bg-blue-500": isActive,
 *   "bg-gray-200": !isActive
 * })
 *
 * // Resolvendo conflitos
 * cn("px-2", "px-4") // "px-4" (remove conflito, mantém o último)
 *
 * // Em componentes
 * function Button({ className, variant }) {
 *   return (
 *     <button
 *       className={cn(
 *         "px-4 py-2 rounded", // classes base
 *         variant === "primary" && "bg-blue-500 text-white",
 *         variant === "secondary" && "bg-gray-200 text-gray-900",
 *         className // permite override personalizado
 *       )}
 *     />
 *   )
 * }
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
