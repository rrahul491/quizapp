import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn--primary',
    secondary: 'btn--secondary',
    danger: 'btn--danger',
  };
  const sizeClasses = {
    small: 'btn--small',
    medium: 'btn--medium',
    large: 'btn--large',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
    disabled ? 'btn--disabled' : ''
  } ${className}`.trim();

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
