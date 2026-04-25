/**
 * Representa un método numérico disponible en la aplicación.
 * Cada método tiene un identificador único, nombre, categoría y descripción.
 */
export interface NumericalMethod {
  /** Identificador único del método (ej: "bisection", "newton-raphson") */
  id: string;
  /** Nombre legible del método */
  name: string;
  /** Categoría del método */
  category: "root-finding" | "integration" | "interpolation";
  /** Descripción breve del método */
  description: string;
  /** Fundamento teórico resumido */
  theoreticalBasis: string;
  /** Icono representativo (emoji o nombre de icono) */
  icon?: string;
}
