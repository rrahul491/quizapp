import React, { useState, useEffect } from 'react';
import Timer from '../../molecules/Timer/Timer';
import QuestionCard from '../../molecules/QuestionCard/QuestionCard';
import Button from '../../atoms/Button/Button';
import quizData from '../../../data/quizData.json';

interface QuizProps {
  onQuizComplete: (results: QuizResult[]) => void;
  className?: string;
}

interface QuizResult {
  questionId: number;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

const Quiz: React.FC<QuizProps> = ({ onQuizComplete, className = '' }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const totalTime = 5 * 60; // 5 minutes in seconds

  const handleAnswerSelect = (answer: string) => {
    if (!isQuestionSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (isQuestionSubmitted) return;

    const correctAnswer = currentQuestion.options[currentQuestion.correctAnswer];
    const isCorrect = selectedAnswer === correctAnswer;

    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer,
      isCorrect,
    };

    setQuizResults(prev => [...prev, result]);
    setIsQuestionSubmitted(true);

    // Start animation and auto-advance to next question
    setIsAnimating(true);
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsQuestionSubmitted(false);
        setIsAnimating(false);
      } else {
        setIsQuizComplete(true);
        onQuizComplete([...quizResults, result]);
      }
    }, 500);
  };

  const handleTimeUp = () => {
    if (!isQuestionSubmitted) {
      handleSubmitAnswer();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isQuizComplete) {
    return (
      <div className={`quiz quiz--complete ${className}`}>
        <div className="quiz__complete-message">
          <h2 className="quiz__complete-title">Quiz Complete!</h2>
          <p className="quiz__complete-text">
            You have completed all {totalQuestions} questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`quiz ${className}`}>
      <div className="quiz__header">
        <div className="quiz__info">
          <div className="quiz__progress">
            <span className="quiz__progress-text">
              Question {currentQuestionIndex + 1} out of {totalQuestions}
            </span>
          </div>
          <div className="quiz__total-time">
            <svg className="quiz__time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <span className="quiz__total-time-text">Total: {formatTime(totalTime)}</span>
          </div>
        </div>
        <Timer
          duration={30}
          onTimeUp={handleTimeUp}
          className="quiz__timer"
        />
      </div>

      <div className="quiz__content">
        <div className={`quiz__question-container ${isAnimating ? 'quiz__question-container--animating' : ''}`}>
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            disabled={isQuestionSubmitted}
            className="quiz__question"
          />
        </div>

        <div className="quiz__actions">
          <Button
            onClick={handleSubmitAnswer}
            disabled={isQuestionSubmitted || !selectedAnswer}
            variant="primary"
            size="large"
            className="quiz__submit-btn"
          >
            {isQuestionSubmitted ? 'Submitted' : 'Submit Answer'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
