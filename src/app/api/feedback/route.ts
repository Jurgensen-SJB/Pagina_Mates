import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Instanciar el cliente con la clave desde las variables de entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { question, userAnswer, correctAnswer, explanationBase, method } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        feedback: "Error: No se ha configurado la variable de entorno GEMINI_API_KEY. Por favor, añade tu clave API de Gemini a Vercel o tu archivo .env local."
      });
    }

    // Inicializar el modelo
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Prompt del sistema (incorporado en el texto para ser más directo con la API)
    const prompt = `
Eres un profesor experto en métodos numéricos y matemáticas. Tu objetivo es ayudar a un estudiante que acaba de responder incorrectamente una pregunta de un examen sobre el método de ${method}.

Pregunta que se le hizo al estudiante:
"${question}"

Su respuesta incorrecta fue: "${userAnswer}"

La respuesta correcta es: "${correctAnswer}"

Contexto adicional de por qué es la correcta: "${explanationBase}"

Tu tarea:
Escribe un mensaje de retroalimentación constructiva, en español, dirigido al estudiante. 
1. Usa **Markdown** para dar formato al texto (usa negritas para resaltar conceptos clave).
2. Usa **emojis** relevantes (💡, 📌, 🚀, ❌, ✅) para que la lectura sea muy visual, dinámica y atractiva.
3. Estructura tu respuesta usando **listas con viñetas** o pequeños párrafos para que sea fácil de leer y escanear visualmente.
4. Explícale por qué su respuesta es incorrecta de forma muy amable, y luego enséñale el concepto correcto usando el contexto.
5. Sé conciso y directo (no más de 3 puntos breves o párrafos cortos).
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();

    return NextResponse.json({ feedback });

  } catch (error: any) {
    console.error('Error in AI feedback API:', error);
    let errorMessage = 'Ocurrió un error al generar la retroalimentación.';
    
    const errorStr = error?.message || error?.toString() || '';
    if (errorStr.includes('API key was reported as leaked') || errorStr.includes('leaked')) {
      errorMessage = 'Error: Tu GEMINI_API_KEY ha sido reportada como filtrada (leaked) en internet y Google la ha desactivado por seguridad. Por favor, genera otra clave API en Google AI Studio y actualiza tu archivo .env.local.';
    } else if (errorStr.includes('API key not valid') || errorStr.includes('not valid')) {
      errorMessage = 'Error: Tu GEMINI_API_KEY no es válida. Por favor, verifica la clave API en tu archivo .env.local.';
    } else {
      errorMessage = `Error: ${errorStr}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
