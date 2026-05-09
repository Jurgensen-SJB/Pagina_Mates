import { TestWizard } from "@/presentation/components/test/TestWizard";

export const metadata = {
  title: "Test de Conocimientos | Métodos Numéricos",
  description: "Pon a prueba tus conocimientos sobre métodos numéricos con asistencia de IA.",
};

export default function TestPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="gradient-text">Test de Conocimientos</span>
          </h1>
          <p className="mt-4 text-xl" style={{ color: 'var(--text-secondary)' }}>
            Evalúa tu comprensión de los métodos numéricos. Si te equivocas, nuestro Agente de IA te ayudará a entender por qué.
          </p>
        </div>

        <TestWizard />
      </div>
    </div>
  );
}
