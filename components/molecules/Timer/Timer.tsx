import React, { useState, useEffect, useRef } from 'react';
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
  const [progress, setProgress] = useState(100);
  const rafIdRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    // reset and start animation
    setTimeLeft(duration);
    setProgress(100);
    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = (now - startRef.current) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(Math.ceil(remaining));
      setProgress((remaining / duration) * 100);
      if (remaining <= 0) {
        onTimeUp();
        return;
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [duration, onTimeUp]);

  const getProgressColor = (): 'blue' | 'yellow' | 'red' => {
    // Green all the time, red only in last 5 seconds (when progress <= 25%)
    if (progress <= 25) return 'red';
    return 'blue'; // This will be green in our CSS
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
