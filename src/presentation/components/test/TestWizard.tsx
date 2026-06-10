"use client";

import React, { useState, useEffect } from "react";
import questionBank from "@/infrastructure/data/questionBank.json";
import { Question } from "@/domain/test/Question";
import ReactMarkdown from "react-markdown";

export function TestWizard() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  // Obtener todos los métodos únicos disponibles
  const availableMethods = Array.from(new Set(questionBank.map((q) => q.method)));

  const startTest = (method: string) => {
    setSelectedMethod(method);
    
    let filteredQuestions = questionBank as Question[];
    if (method !== "Todos") {
      filteredQuestions = filteredQuestions.filter((q) => q.method === method);
    }

    // Mezclar las preguntas aleatoriamente
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    // Tomar hasta 8 preguntas
    setQuestions(shuffled.slice(0, 8));
    
    setCurrentQuestionIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleNextQuestion = async () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      moveToNext();
    } else {
      // Pedir feedback de IA si la respuesta es incorrecta
      setIsLoadingFeedback(true);
      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: currentQuestion.question,
            userAnswer: selectedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            explanationBase: currentQuestion.explanationBase,
            method: currentQuestion.method,
          }),
        });
        const data = await response.json();
        
        if (response.ok && data.feedback && !data.feedback.startsWith("Error:")) {
          setFeedback(data.feedback);
        } else {
          const errorMsg = data.feedback || data.error || "Error desconocido";
          setFeedback(
            `### ⚠️ Servicio de IA no disponible\n` +
            `No se pudo generar una explicación de IA personalizada (${errorMsg}).\n\n` +
            `### ✅ Respuesta Correcta\n` +
            `**${currentQuestion.correctAnswer}**\n\n` +
            `### 💡 Explicación del Método\n` +
            `${currentQuestion.explanationBase}`
          );
        }
      } catch (e) {
        setFeedback(
          `### ⚠️ Error de Conexión\n` +
          `Hubo un problema de red al contactar al Agente de IA.\n\n` +
          `### ✅ Respuesta Correcta\n` +
          `**${currentQuestion.correctAnswer}**\n\n` +
          `### 💡 Explicación del Método\n` +
          `${currentQuestion.explanationBase}`
        );
      } finally {
        setIsLoadingFeedback(false);
      }
    }
  };

  const moveToNext = () => {
    setFeedback(null);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  if (!selectedMethod) {
    return (
      <div className="max-w-2xl mx-auto p-8 glass-card animate-fadeInUp">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>Selecciona una temática para el Test</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--text-secondary)' }}>
          Cada test consta de hasta 8 preguntas. Si te equivocas, un Agente de Inteligencia Artificial analizará tu respuesta y te explicará el concepto.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => startTest("Todos")}
            className="p-4 rounded-xl font-bold transition-transform hover:scale-105"
            style={{ background: 'var(--gradient-primary)', color: '#fff', border: '1px solid var(--border)' }}
          >
            Todos los Métodos
          </button>
          {availableMethods.map((method) => (
            <button
              key={method}
              onClick={() => startTest(method)}
              className="p-4 glass-card hover:bg-[var(--surface-hover)] font-medium transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {method}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto p-8 glass-card animate-fadeInUp text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>¡Test Finalizado!</h2>
        <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
          Tu puntuación: <span className="font-bold text-2xl" style={{ color: 'var(--primary-light)' }}>{score}</span> de {questions.length}
        </p>
        <button
          onClick={() => setSelectedMethod(null)}
          className="px-6 py-3 rounded-full font-bold transition-transform hover:scale-105"
          style={{ background: 'var(--gradient-primary)', color: '#fff' }}
        >
          Volver a Empezar
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600 dark:text-gray-300">
        Cargando preguntas...
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto p-8 glass-card animate-fadeInUp">
      <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
        <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: 'var(--surface-hover)', color: 'var(--primary-light)' }}>
          {currentQuestion.method}
        </span>
        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          Pregunta {currentQuestionIndex + 1} de {questions.length}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        {currentQuestion.question}
      </h3>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            disabled={!!feedback || isLoadingFeedback}
            onClick={() => setSelectedAnswer(option)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selectedAnswer === option
                ? "border-[var(--primary)] bg-[var(--surface-hover)]"
                : "border-[var(--border)] hover:border-[var(--primary-light)]"
            } ${(feedback || isLoadingFeedback) ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ color: 'var(--text-secondary)' }}
          >
            {option}
          </button>
        ))}
      </div>

      {!feedback && !isLoadingFeedback && (
        <button
          disabled={!selectedAnswer}
          onClick={handleNextQuestion}
          className={`w-full py-3 rounded-xl font-bold transition-transform ${
            selectedAnswer
              ? "hover:scale-[1.02]"
              : "opacity-50 cursor-not-allowed"
          }`}
          style={{ background: selectedAnswer ? 'var(--gradient-primary)' : 'var(--surface-hover)', color: selectedAnswer ? '#fff' : 'var(--text-muted)' }}
        >
          Confirmar Respuesta
        </button>
      )}

      {isLoadingFeedback && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
          <p className="text-blue-700 dark:text-blue-300 animate-pulse font-medium">
            🧠 El Agente de IA está analizando tu respuesta...
          </p>
        </div>
      )}

      {feedback && (
        <div className="mt-8 p-6 rounded-xl border" style={{ borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}>
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--danger)' }}>
            ⚠️ Respuesta Incorrecta
          </h4>
          <div className="prose prose-sm dark:prose-invert max-w-none mb-6" style={{ color: 'var(--text-secondary)' }}>
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
          <button
            onClick={moveToNext}
            className="w-full py-3 rounded-xl font-bold transition-colors"
            style={{ background: 'var(--surface-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            Continuar a la siguiente pregunta
          </button>
        </div>
      )}
    </div>
  );
}
