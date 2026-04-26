import { NumericalMethod } from '@/domain/entities/NumericalMethod';

/**
 * Datos de todos los métodos numéricos disponibles.
 */
export const METHODS: NumericalMethod[] = [
  // === RAÍCES DE ECUACIONES ===
  {
    id: 'bisection',
    name: 'Bisección',
    category: 'root-finding',
    description: 'Encuentra raíces dividiendo repetidamente el intervalo por la mitad. Convergencia garantizada pero lenta.',
    theoreticalBasis: 'Si f es continua en [a,b] y f(a)·f(b) < 0, entonces existe al menos una raíz en (a,b). Se divide el intervalo sucesivamente.',
    icon: '✂️',
  },
  {
    id: 'false-position',
    name: 'Falsa Posición',
    category: 'root-finding',
    description: 'Similar a bisección pero usa interpolación lineal para elegir el punto de división. Generalmente converge más rápido.',
    theoreticalBasis: 'Usa la recta secante entre (a, f(a)) y (b, f(b)) para aproximar la raíz: c = a - f(a)(b-a)/(f(b)-f(a)).',
    icon: '📐',
  },
  {
    id: 'fixed-point',
    name: 'Punto Fijo',
    category: 'root-finding',
    description: 'Transforma f(x)=0 en x=g(x) y aplica iteración. Convergencia depende de |g\'(x)| < 1.',
    theoreticalBasis: 'Si g es continua en [a,b], g([a,b]) ⊂ [a,b] y |g\'(x)| < 1, entonces la iteración xₙ₊₁ = g(xₙ) converge.',
    icon: '🎯',
  },
  {
    id: 'newton-raphson',
    name: 'Newton-Raphson',
    category: 'root-finding',
    description: 'Método de convergencia cuadrática que usa la derivada. Muy rápido cerca de la raíz.',
    theoreticalBasis: 'Usa la tangente en xₙ para aproximar: xₙ₊₁ = xₙ - f(xₙ)/f\'(xₙ). Convergencia cuadrática si x₀ está cerca de la raíz.',
    icon: '⚡',
  },

  // === INTEGRACIÓN NUMÉRICA ===
  {
    id: 'trapezoid',
    name: 'Regla del Trapecio',
    category: 'integration',
    description: 'Aproxima el área bajo la curva usando trapecio(s). Simple pero efectiva para funciones suaves.',
    theoreticalBasis: 'I ≈ (h/2)[f(x₀) + 2Σf(xᵢ) + f(xₙ)], h = (b-a)/n. Error O(h²).',
    icon: '📊',
  },
  {
    id: 'simpson-13',
    name: 'Simpson 1/3',
    category: 'integration',
    description: 'Aproxima con parábolas. Más precisa que el trapecio. Requiere n par.',
    theoreticalBasis: 'I ≈ (h/3)[f(x₀) + 4Σf(x_impar) + 2Σf(x_par) + f(xₙ)]. Error O(h⁴).',
    icon: '📈',
  },
  {
    id: 'simpson-38',
    name: 'Simpson 3/8',
    category: 'integration',
    description: 'Variante de Simpson con cúbicas. Requiere n divisible por 3.',
    theoreticalBasis: 'I ≈ (3h/8)[f(x₀) + 3Σf(x_no_múlt_3) + 2Σf(x_múlt_3) + f(xₙ)]. Error O(h⁴).',
    icon: '📉',
  },

  // === INTERPOLACIÓN ===
  {
    id: 'linear-interpolation',
    name: 'Interpolación Lineal',
    category: 'interpolation',
    description: 'Conecta 2 puntos con una línea recta. La forma más simple de interpolación.',
    theoreticalBasis: 'P(x) = y₀ + (y₁-y₀)/(x₁-x₀) · (x-x₀). Polinomio de grado 1.',
    icon: '📏',
  },
  {
    id: 'lagrange',
    name: 'Lagrange',
    category: 'interpolation',
    description: 'Polinomio interpolante de grado n-1 para n puntos. Forma clásica con polinomios base Lᵢ(x).',
    theoreticalBasis: 'P(x) = Σyᵢ·Lᵢ(x), donde Lᵢ(x) = Π(x-xⱼ)/(xᵢ-xⱼ) para j≠i. Polinomio único de grado ≤ n-1.',
    icon: '🔮',
  },
  {
    id: 'newton-dd',
    name: 'Newton (Dif. Divididas)',
    category: 'interpolation',
    description: 'Usa diferencias divididas para construir el polinomio. Más eficiente para agregar puntos.',
    theoreticalBasis: 'P(x) = f[x₀] + f[x₀,x₁](x-x₀) + f[x₀,x₁,x₂](x-x₀)(x-x₁) + ... Reutiliza cálculos previos.',
    icon: '🧮',
  },
];

/**
 * Obtiene un método por su ID.
 */
export function getMethodById(id: string): NumericalMethod | undefined {
  return METHODS.find(m => m.id === id);
}

/**
 * Obtiene métodos filtrados por categoría.
 */
export function getMethodsByCategory(category: string): NumericalMethod[] {
  return METHODS.filter(m => m.category === category);
}

/**
 * Categorías disponibles con sus labels.
 */
export const CATEGORIES = [
  { id: 'root-finding', name: 'Raíces de Ecuaciones', icon: '🔍', color: '#818cf8' },
  { id: 'integration', name: 'Integración Numérica', icon: '∫', color: '#a78bfa' },
  { id: 'interpolation', name: 'Interpolación', icon: '📊', color: '#67e8f9' },
] as const;
