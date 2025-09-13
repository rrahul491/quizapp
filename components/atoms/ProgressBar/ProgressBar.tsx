import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: 'blue' | 'yellow' | 'red';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'blue',
  className = '',
}) => {
  const baseClasses = 'progress-bar';
  const colorClasses = {
    blue: 'progress-bar--blue',
    yellow: 'progress-bar--yellow',
    red: 'progress-bar--red',
  };

  const progressBarClasses = `${baseClasses} ${colorClasses[color]} ${className}`.trim();

  return (
    <div className={progressBarClasses}>
      <div
        className="progress-bar__fill"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

export default ProgressBar;
