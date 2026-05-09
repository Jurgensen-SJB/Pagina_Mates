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
        setFeedback(data.feedback || data.error);
      } catch (e) {
        setFeedback("Hubo un error al contactar al Agente de IA. La respuesta correcta era: " + currentQuestion.correctAnswer);
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
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Selecciona una temática para el Test</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Cada test consta de hasta 8 preguntas. Si te equivocas, un Agente de Inteligencia Artificial analizará tu respuesta y te explicará el concepto.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => startTest("Todos")}
            className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Todos los Métodos
          </button>
          {availableMethods.map((method) => (
            <button
              key={method}
              onClick={() => startTest(method)}
              className="p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium border border-gray-200 dark:border-gray-600 transition-colors shadow-sm"
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
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">¡Test Finalizado!</h2>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Tu puntuación: <span className="font-bold text-indigo-600 dark:text-indigo-400">{score}</span> de {questions.length}
        </p>
        <button
          onClick={() => setSelectedMethod(null)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-md"
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
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full">
          {currentQuestion.method}
        </span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Pregunta {currentQuestionIndex + 1} de {questions.length}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            disabled={!!feedback || isLoadingFeedback}
            onClick={() => setSelectedAnswer(option)}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              selectedAnswer === option
                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                : "border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 text-gray-700 dark:text-gray-200"
            } ${(feedback || isLoadingFeedback) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {option}
          </button>
        ))}
      </div>

      {!feedback && !isLoadingFeedback && (
        <button
          disabled={!selectedAnswer}
          onClick={handleNextQuestion}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            selectedAnswer
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
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
        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-lg">
          <h4 className="text-lg font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
            ⚠️ Respuesta Incorrecta
          </h4>
          <div className="text-gray-800 dark:text-gray-200 prose prose-sm dark:prose-invert mb-6">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
          <button
            onClick={moveToNext}
            className="w-full py-3 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Continuar a la siguiente pregunta
          </button>
        </div>
      )}
    </div>
  );
}
