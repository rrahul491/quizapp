import React, { useState, useEffect } from 'react';
import ProgressBar from '../../atoms/ProgressBar/ProgressBar';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  duration,
  onTimeUp,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
      setProgress(((duration - timeLeft + 1) / duration) * 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, duration, onTimeUp]);

  const getProgressColor = (): 'blue' | 'yellow' | 'red' => {
    if (progress >= 90) return 'red';
    if (progress >= 50) return 'yellow';
    return 'blue';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`timer ${className}`}>
      <div className="timer__container">
        <ProgressBar
          progress={progress}
          color={getProgressColor()}
          className="timer__progress"
        />
        <div className="timer__display">
          <svg className="timer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <span className="timer__time">{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
