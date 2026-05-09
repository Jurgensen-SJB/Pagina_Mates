import { TestWizard } from "@/presentation/components/test/TestWizard";

export const metadata = {
  title: "Test de Conocimientos | Métodos Numéricos",
  description: "Pon a prueba tus conocimientos sobre métodos numéricos con asistencia de IA.",
};

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Test de Conocimientos
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Evalúa tu comprensión de los métodos numéricos. Si te equivocas, nuestro Agente de IA te ayudará a entender por qué.
          </p>
        </div>

        <TestWizard />
      </div>
    </div>
  );
}
