'use client';

import React, { useState, useEffect } from 'react';
import Quiz from '../components/organisms/Quiz/Quiz';
import Login from '../components/organisms/Login/Login';
import SimpleThemeToggle from '../components/atoms/SimpleThemeToggle/SimpleThemeToggle';
import { useHydration } from '../hooks/useHydration';

interface QuizResult {
  questionId: number;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

interface UserData {
  email: string;
  phone: string;
  password: string;
  agreedToTerms: boolean;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const isHydrated = useHydration();

  // Check if user is already logged in - only after hydration
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      const savedUserData = localStorage.getItem('quiz-user-data');
      if (savedUserData) {
        try {
          const parsedData = JSON.parse(savedUserData);
          setUserData(parsedData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('quiz-user-data');
        }
      }
    }
  }, [isHydrated]);

  const handleLoginSuccess = (userData: UserData) => {
    setUserData(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quiz-user-data');
    }
    setUserData(null);
    setIsLoggedIn(false);
    setQuizStarted(false);
    setQuizResults([]);
  };

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

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background-solid)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  if (quizStarted) {
    return (
      <div className="min-h-screen py-8" style={{ background: 'var(--background-solid)' }}>
        <SimpleThemeToggle />
        <div className="fixed top-4 right-16 z-10">
          <button
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            className="p-3 rounded-lg"
            style={{
              background: 'var(--question-box)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
        <Quiz onQuizComplete={handleQuizComplete} />
      </div>
    );
  }

  if (quizResults.length > 0) {
    const score = calculateScore();
    const totalQuestions = quizResults.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center py-4 sm:py-8" style={{ background: 'var(--background-solid)' }}>
        <SimpleThemeToggle />
        <div className="fixed top-4 right-16 z-10">
          <button
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            className="p-3 rounded-lg"
            style={{
              background: 'var(--question-box)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
        <div className="max-w-2xl mx-auto p-4 sm:p-8 rounded-lg shadow-lg text-center" style={{ background: 'var(--question-box)', border: '1px solid var(--border)' }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--text-primary)' }}>Quiz Results</h1>
          <div className="space-y-4 mb-6 sm:mb-8">
            <div className="text-4xl sm:text-6xl font-bold" style={{ color: 'var(--hover-selected)' }}>{score}/{totalQuestions}</div>
            <div className="text-xl sm:text-2xl" style={{ color: 'var(--text-secondary)' }}>{percentage}%</div>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Correct Answers</p>
          </div>
          
          <div className="space-y-4 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Question Review</h2>
            <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
              {quizResults.map((result, index) => (
                <div key={result.questionId} className="p-2 sm:p-3 rounded-lg text-left" style={{
                  backgroundColor: result.isCorrect ? 'var(--correct)' : 'var(--wrong)',
                  color: 'white'
                }}>
                  <div className="font-medium text-sm sm:text-base">Question {result.questionId}</div>
                  <div className="text-xs sm:text-sm opacity-90">
                    Your answer: {result.selectedAnswer || 'No answer'}
                  </div>
                  <div className="text-xs sm:text-sm opacity-90">
                    Correct answer: {result.correctAnswer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
            style={{ backgroundColor: 'var(--hover-selected)' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-4 sm:py-8" style={{ background: 'var(--background-solid)' }}>
      <SimpleThemeToggle />
      <div className="fixed top-4 right-16 z-10">
        <button
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          className="p-3 rounded-lg"
          style={{
            background: 'var(--question-box)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
      <div className="max-w-2xl mx-auto p-4 sm:p-8 rounded-lg shadow-lg text-center" style={{ background: 'var(--question-box)', border: '1px solid var(--border)' }}>
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--text-primary)' }}>Welcome to the Quiz App</h1>
        <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: 'var(--text-secondary)' }}>
          Test your knowledge with our 10-question quiz. Each question has a 20-second time limit.
        </p>
        <div className="space-y-4 mb-6 sm:mb-8">
          <div className="text-left space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Quiz Rules:</h2>
            <ul className="text-sm sm:text-base space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li>• 10 multiple choice questions</li>
              <li>• 20 seconds per question</li>
              <li>• Select one answer and submit</li>
              <li>• Auto-submit when time runs out</li>
              <li>• No answer = 0 points for that question</li>
            </ul>
          </div>
        </div>
        <button
          onClick={handleStartQuiz}
          className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors font-medium text-base sm:text-lg"
          style={{
            background: 'var(--hover-selected)',
            color: 'var(--button-on-primary)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.95'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
