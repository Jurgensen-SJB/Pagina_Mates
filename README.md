# 🧮 Interactive Numerical Methods Web App

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-success?style=for-the-badge)

Una aplicación web moderna, interactiva y de alto rendimiento diseñada para resolver problemas matemáticos utilizando **Métodos Numéricos**. Construida con tecnología de vanguardia y estructurada estrictamente bajo el patrón de **Clean Architecture**, asegurando que el código sea escalable, mantenible y robusto.

## ✨ Características Principales

- **Diseño Premium**: Interfaz moderna en modo oscuro (Dark Mode) con estética *Glassmorphism*, animaciones fluidas y diseño responsivo.
- **Teclado Científico Integrado**: Entrada de funciones matemáticas de forma intuitiva a través de un teclado virtual flotante con soporte para trigonometría, logaritmos y operaciones avanzadas.
- **Resultados Paso a Paso**: Tablas interactivas que desglosan cada iteración de cálculo, mostrando el error relativo aproximado (Ea), valores intermedios y el estado de convergencia.
- **Visualización Gráfica**: Gráficas dinámicas generadas con `Recharts` que dibujan la función evaluada, marcan el punto raíz exacto y muestran curvas de convergencia del error.
- **Validación Robusta**: Prevención de errores matemáticos (división por cero, raíces complejas, divergencia) con retroalimentación visual clara.

---

## 📐 Métodos Disponibles

### 🔍 Raíces de Ecuaciones
- **Método de Bisección**: Método cerrado, convergencia garantizada.
- **Falsa Posición**: Variante de bisección con convergencia lineal más rápida.
- **Punto Fijo**: Método abierto, basado en la forma x = g(x).
- **Newton-Raphson**: Convergencia cuadrática rápida (soporta derivadas automáticas o manuales).

### ∫ Integración Numérica
- **Regla del Trapecio**: Aproximación de área mediante trapecios.
- **Simpson 1/3**: Precisión mejorada (requiere número par de subintervalos).
- **Simpson 3/8**: Alta precisión para polinomios de grado superior.

### 📊 Interpolación
- **Interpolación Lineal**: Conecta dos puntos con una línea recta.
- **Interpolación de Lagrange**: Polinomio único que pasa por todos los puntos.
- **Diferencias Divididas de Newton**: Construcción progresiva del polinomio.

---

## 🏗️ Estructura del Proyecto (Clean Architecture)

El proyecto está diseñado para separar la lógica de negocio de la interfaz de usuario, garantizando un alto grado de desacoplamiento.

```text
src/
├── domain/            # Capa Core (Sin dependencias externas)
│   ├── entities/      # Entidades de dominio (NumericalMethod, StepDetail)
│   ├── use-cases/     # Lógica de cálculo matemático puro (Bisection, Newton, etc.)
│   └── validators/    # Validaciones matemáticas universales
├── application/       # Casos de Uso y Servicios
│   ├── dtos/          # Objetos de transferencia de datos
│   └── services/      # Orquestación (CalculationService coordina los cálculos)
├── infrastructure/    # Implementaciones técnicas externas
│   ├── math-parser/   # Parseo y evaluación de strings a funciones (mathjs)
│   └── chart-provider/# Configuración global de gráficas (Recharts)
└── presentation/      # Capa de Interfaz (Next.js, React)
    ├── components/    # Componentes reutilizables (Botones, Gráficas, Teclado)
    ├── hooks/         # Lógica de estado de UI (useCalculation)
    └── app/           # Rutas y páginas de Next.js 15
```

---

## 🚀 Instalación y Uso Local

Para correr este proyecto en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Jurgensen-SJB/Pagina_Mates.git
   cd Pagina_Mates
   ```

2. **Instalar dependencias:**
   Asegúrate de tener Node.js instalado (v18+).
   ```bash
   npm install
   ```

3. **Variables de Entorno:**
   Copia el archivo de ejemplo para las variables locales:
   ```bash
   cp .env.example .env.local
   ```

4. **Correr el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) + CSS Modules
- **Gráficas**: [Recharts](https://recharts.org/)
- **Motor Matemático**: Algoritmos nativos de TS combinados con evaluadores de strings.

---

## 👤 Autor

Desarrollado para facilitar el aprendizaje y visualización interactiva del análisis numérico.
