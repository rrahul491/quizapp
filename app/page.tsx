'use client';

import React, { useState } from 'react';
import Quiz from '../components/organisms/Quiz/Quiz';

interface QuizResult {
  questionId: number;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function Home() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  const handleQuizComplete = (results: QuizResult[]) => {
    setQuizResults(results);
    setQuizStarted(false);
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuizResults([]);
  };

  const calculateScore = () => {
    return quizResults.filter(result => result.isCorrect).length;
  };

  if (quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Quiz onQuizComplete={handleQuizComplete} />
      </div>
    );
  }

  if (quizResults.length > 0) {
    const score = calculateScore();
    const totalQuestions = quizResults.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 sm:py-8">
        <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Quiz Results</h1>
          <div className="space-y-4 mb-6 sm:mb-8">
            <div className="text-4xl sm:text-6xl font-bold text-blue-600">{score}/{totalQuestions}</div>
            <div className="text-xl sm:text-2xl text-gray-600">{percentage}%</div>
            <p className="text-sm sm:text-base text-gray-500">Correct Answers</p>
          </div>
          
          <div className="space-y-4 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Question Review</h2>
            <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
              {quizResults.map((result, index) => (
                <div key={result.questionId} className={`p-2 sm:p-3 rounded-lg text-left ${
                  result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="font-medium text-sm sm:text-base">Question {result.questionId}</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Your answer: {result.selectedAnswer || 'No answer'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Correct answer: {result.correctAnswer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 sm:py-8">
      <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">Welcome to the Quiz App</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
          Test your knowledge with our 10-question quiz. Each question has a 30-second time limit.
        </p>
        <div className="space-y-4 mb-6 sm:mb-8">
          <div className="text-left space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Quiz Rules:</h2>
            <ul className="text-sm sm:text-base text-gray-600 space-y-1">
              <li>• 10 multiple choice questions</li>
              <li>• 30 seconds per question</li>
              <li>• Select one answer and submit</li>
              <li>• Auto-submit when time runs out</li>
              <li>• No answer = 0 points for that question</li>
            </ul>
          </div>
        </div>
        <button
          onClick={handleStartQuiz}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base sm:text-lg"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
