const fs = require('fs');
const path = require('path');

const methods = [
  { id: 'Bisección', topic: 'root-finding' },
  { id: 'Newton-Raphson', topic: 'root-finding' },
  { id: 'Secante', topic: 'root-finding' },
  { id: 'Falsa Posición', topic: 'root-finding' },
  { id: 'Punto Fijo', topic: 'root-finding' },
  { id: 'Regla del Trapecio', topic: 'integration' },
  { id: 'Simpson 1/3', topic: 'integration' },
  { id: 'Simpson 3/8', topic: 'integration' },
  { id: 'Interpolación Lineal', topic: 'interpolation' },
  { id: 'Lagrange', topic: 'interpolation' }
];

// Base questions to generate variations from
const baseQuestions = {
  'root-finding': [
    { q: "¿Cuál es el objetivo principal del método de {method}?", a: "Encontrar la raíz de una ecuación no lineal f(x) = 0.", options: ["Encontrar la derivada", "Encontrar la integral", "Resolver sistemas lineales"] },
    { q: "En el método de {method}, si el error de la iteración actual es E, ¿cuál es el criterio de parada más común?", a: "Cuando el error absoluto es menor a una tolerancia predefinida.", options: ["Cuando el error es cero exacto", "Cuando se alcanza 1 iteración", "Cuando el error aumenta"] },
    { q: "¿Qué pasa si la función no cruza el eje x en el método de {method}?", a: "El método no podrá encontrar una raíz real.", options: ["El método converge más rápido", "El método encuentra una raíz compleja siempre", "El resultado es infinito"] },
    { q: "Si aplicamos {method} y el valor de f(x) se acerca a cero, esto indica que:", a: "Nos estamos acercando a la raíz.", options: ["El método está divergiendo", "Hay un error de cálculo", "La función no tiene solución"] },
  ],
  'integration': [
    { q: "¿Qué busca aproximar el método de {method}?", a: "El área bajo la curva de una función en un intervalo.", options: ["La pendiente de la curva", "El punto máximo de la función", "La raíz de la ecuación"] },
    { q: "Al aumentar el número de subintervalos en {method}, por lo general:", a: "El error de truncamiento disminuye.", options: ["El error de redondeo desaparece", "El cálculo se vuelve instantáneo", "El área aumenta infinitamente"] },
    { q: "¿Cuál es una limitación geométrica al aplicar {method}?", a: "La precisión depende de la forma de la curva y el tamaño del paso.", options: ["Solo funciona para líneas rectas", "No se puede usar con funciones positivas", "Requiere conocer la integral exacta primero"] },
  ],
  'interpolation': [
    { q: "El propósito de usar {method} es:", a: "Encontrar una función polinómica que pase exactamente por un conjunto de puntos dados.", options: ["Aproximar puntos mediante mínimos cuadrados", "Encontrar el área entre los puntos", "Calcular las raíces del polinomio"] },
    { q: "Si tenemos N puntos de datos, {method} generará un polinomio de grado máximo:", a: "N - 1", options: ["N", "N + 1", "2N"] },
    { q: "Una desventaja de usar polinomios de alto grado en {method} es:", a: "El fenómeno de Runge (oscilaciones en los extremos).", options: ["Que la curva se vuelve una línea recta", "Que el polinomio ya no pasa por los puntos", "Que el cálculo es imposible de realizar"] },
  ]
};

// Method specific facts
const specificFacts = {
  'Bisección': {
    req: "La función debe ser continua y f(a)*f(b) < 0.",
    formula: "xr = (a+b)/2",
    conv: "Lineal (lenta pero segura).",
    extra: "Se basa en el Teorema del Valor Intermedio (Bolzano)."
  },
  'Newton-Raphson': {
    req: "Se requiere conocer la derivada f'(x).",
    formula: "x1 = x0 - f(x0)/f'(x0)",
    conv: "Cuadrática (muy rápida cerca de la raíz).",
    extra: "Falla si la derivada se hace cero."
  },
  'Secante': {
    req: "Requiere dos puntos iniciales, pero no necesita calcular la derivada.",
    formula: "Usa una aproximación de la derivada mediante diferencias finitas.",
    conv: "Superlineal (entre lineal y cuadrática).",
    extra: "Es una alternativa a Newton-Raphson cuando la derivada es difícil de obtener."
  },
  'Falsa Posición': {
    req: "Requiere un intervalo [a,b] donde f(a)*f(b) < 0.",
    formula: "xr = b - f(b)(a-b)/(f(a)-f(b))",
    conv: "Lineal, a menudo más rápida que bisección.",
    extra: "Usa interpolación lineal entre los extremos del intervalo para encontrar la raíz."
  },
  'Punto Fijo': {
    req: "Requiere reescribir la función como x = g(x).",
    formula: "x_i+1 = g(x_i)",
    conv: "Lineal, depende de que |g'(x)| < 1.",
    extra: "Puede divergir si la derivada de g(x) es mayor a 1."
  },
  'Regla del Trapecio': {
    req: "Aproxima el área usando trapecios (polinomios de grado 1).",
    formula: "I = (h/2) * (f(a) + f(b)) para un solo segmento.",
    conv: "El error global es proporcional a h^2.",
    extra: "Es la fórmula de Newton-Cotes más simple."
  },
  'Simpson 1/3': {
    req: "Requiere un número par de subintervalos (n par).",
    formula: "Aproxima la curva con parábolas (polinomios de grado 2).",
    conv: "El error global es proporcional a h^4.",
    extra: "Usa los coeficientes 1, 4, 2, 4, ..., 1."
  },
  'Simpson 3/8': {
    req: "Requiere que el número de subintervalos sea múltiplo de 3.",
    formula: "Aproxima la curva con polinomios cúbicos (grado 3).",
    conv: "El error global es proporcional a h^4, similar a 1/3.",
    extra: "Usa los coeficientes 1, 3, 3, 2, 3, 3, 2, ..., 1."
  },
  'Interpolación Lineal': {
    req: "Solo necesita dos puntos.",
    formula: "Conecta dos puntos con una línea recta.",
    conv: "Es exacta solo para funciones lineales.",
    extra: "Es el caso más básico de interpolación polinómica."
  },
  'Lagrange': {
    req: "Usa polinomios base L_i(x).",
    formula: "P(x) = suma( y_i * L_i(x) )",
    conv: "El grado máximo es n-1 para n puntos.",
    extra: "Evita resolver un sistema de ecuaciones lineales."
  }
};

const questions = [];
let idCounter = 1;

function generateMethodQuestions(methodDef) {
  const method = methodDef.id;
  const topic = methodDef.topic;
  const facts = specificFacts[method] || {};
  
  // 1. Generate questions from topic bases
  const bases = baseQuestions[topic];
  for (let i = 0; i < bases.length; i++) {
    const qBase = bases[i];
    questions.push({
      id: `${method}-base-${idCounter++}`,
      topic,
      method,
      question: qBase.q.replace('{method}', method),
      options: [qBase.a, ...qBase.options].sort(() => 0.5 - Math.random()),
      correctAnswer: qBase.a,
      explanationBase: `Concepto general de ${topic} aplicado a ${method}.`
    });
  }

  // 2. Generate specific questions from facts
  if (facts.req) {
    questions.push({
      id: `${method}-req-${idCounter++}`,
      topic,
      method,
      question: `¿Cuál es un requerimiento o característica principal del método de ${method}?`,
      options: [
        facts.req,
        "No tiene ningún requerimiento especial.",
        "Solo funciona para números enteros negativos.",
        "Requiere calcular integrales triples."
      ].sort(() => 0.5 - Math.random()),
      correctAnswer: facts.req,
      explanationBase: `Es un fundamento matemático clave para que ${method} funcione.`
    });
  }

  if (facts.formula) {
    questions.push({
      id: `${method}-form-${idCounter++}`,
      topic,
      method,
      question: `¿Cómo se define conceptualmente la iteración o cálculo en ${method}?`,
      options: [
        facts.formula,
        "Sumando todos los valores de x y dividiendo por cero.",
        "Multiplicando la función por una constante aleatoria.",
        "Ignorando los valores de la función y usando solo derivadas."
      ].sort(() => 0.5 - Math.random()),
      correctAnswer: facts.formula,
      explanationBase: `Esta es la base operativa del método numérico de ${method}.`
    });
  }

  if (facts.conv) {
    questions.push({
      id: `${method}-conv-${idCounter++}`,
      topic,
      method,
      question: `¿Cómo es la convergencia o el comportamiento del error en ${method}?`,
      options: [
        facts.conv,
        "Siempre diverge y nunca encuentra la solución.",
        "La convergencia es completamente impredecible.",
        "El error aumenta en cada iteración exponencialmente."
      ].sort(() => 0.5 - Math.random()),
      correctAnswer: facts.conv,
      explanationBase: `La velocidad y seguridad de convergencia son propiedades vitales de ${method}.`
    });
  }

  if (facts.extra) {
    questions.push({
      id: `${method}-ext-${idCounter++}`,
      topic,
      method,
      question: `¿Qué propiedad adicional caracteriza al método de ${method}?`,
      options: [
        facts.extra,
        "Es un método que no se usa en la práctica actual.",
        "Fue descubierto en el año 2020.",
        "Solo se puede calcular a mano y no en computadora."
      ].sort(() => 0.5 - Math.random()),
      correctAnswer: facts.extra,
      explanationBase: `Un dato teórico importante asociado al método.`
    });
  }

  // 3. Generate mathematical variations to reach 20 questions
  let v = 1;
  while (questions.filter(q => q.method === method).length < 20) {
    const variationType = v % 3;
    let questionStr, correct, wrong1, wrong2, wrong3;
    
    if (variationType === 0) {
      questionStr = `Para el método de ${method}, en la iteración número ${v+5}, ¿qué debemos garantizar para no acumular error de redondeo excesivo?`;
      correct = "Usar suficientes cifras significativas y evitar restas de números muy cercanos.";
      wrong1 = "Redondear siempre al entero más cercano.";
      wrong2 = "Detener el algoritmo inmediatamente.";
      wrong3 = "Cambiar a un método analítico.";
    } else if (variationType === 1) {
      questionStr = `Si durante la ejecución de ${method} nos topamos con una discontinuidad en la función, ¿qué es probable que ocurra?`;
      correct = "El método puede fallar o arrojar resultados erróneos si asume continuidad.";
      wrong1 = "El método ignorará la discontinuidad y dará el resultado exacto.";
      wrong2 = "El error de truncamiento se hace cero automáticamente.";
      wrong3 = "La convergencia se vuelve instantánea.";
    } else {
      questionStr = `En el contexto de la programación computacional de ${method}, ¿por qué es importante definir un número máximo de iteraciones?`;
      correct = "Para evitar bucles infinitos en caso de que el método diverja o oscile.";
      wrong1 = "Porque la memoria de la computadora se llena en 10 iteraciones.";
      wrong2 = "Para hacer que el programa corra más lento.";
      wrong3 = "Porque las matemáticas impiden hacer más de 100 iteraciones.";
    }

    questions.push({
      id: `${method}-var-${idCounter++}`,
      topic,
      method,
      question: questionStr,
      options: [correct, wrong1, wrong2, wrong3].sort(() => 0.5 - Math.random()),
      correctAnswer: correct,
      explanationBase: "Concepto importante en la implementación computacional de métodos numéricos."
    });
    v++;
  }
}

methods.forEach(generateMethodQuestions);

const outPath = path.join(__dirname, '../src/infrastructure/data/questionBank.json');
fs.writeFileSync(outPath, JSON.stringify(questions, null, 2));

console.log(`Generated ${questions.length} questions and saved to ${outPath}`);
