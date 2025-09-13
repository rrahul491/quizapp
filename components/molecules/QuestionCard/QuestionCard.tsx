import React from 'react';
import RadioButton from '../../atoms/RadioButton/RadioButton';

interface QuestionCardProps {
  question: {
    id: number;
    question: string;
    options: string[];
  };
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  disabled?: boolean;
  className?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`question-card ${className}`}>
      <div className="question-card__header">
        <h2 className="question-card__title">Question {question.id}</h2>
        <p className="question-card__text">{question.question}</p>
      </div>
      
      <div className="question-card__options">
        {question.options.map((option, index) => (
          <RadioButton
            key={index}
            id={`q${question.id}-option${index}`}
            name={`question-${question.id}`}
            value={option}
            label={option}
            checked={selectedAnswer === option}
            onChange={onAnswerSelect}
            disabled={disabled}
            className="question-card__option"
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
