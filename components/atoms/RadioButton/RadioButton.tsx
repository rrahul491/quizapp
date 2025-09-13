import React from 'react';

interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'radio';
  const disabledClasses = disabled ? 'radio--disabled' : '';

  const radioClasses = `${baseClasses} ${disabledClasses} ${className}`.trim();

  return (
    <div className={radioClasses}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="radio__input"
      />
      <label htmlFor={id} className="radio__label">
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
