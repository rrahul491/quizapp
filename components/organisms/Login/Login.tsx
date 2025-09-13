'use client';

import React, { useState } from 'react';
import Button from '../../atoms/Button/Button';
import SimpleThemeToggle from '../../atoms/SimpleThemeToggle/SimpleThemeToggle';
import styles from './Login.module.css';

interface LoginProps {
  onLoginSuccess: (userData: UserData) => void;
  className?: string;
}

interface UserData {
  email: string;
  phone: string;
  password: string;
  agreedToTerms: boolean;
}

interface FormErrors {
  email?: string;
  phone?: string;
  password?: string;
  terms?: string;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, className = '' }) => {
  const [formData, setFormData] = useState<UserData>({
    email: '',
    phone: '',
    password: '',
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showTerms, setShowTerms] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleInputChange = (field: keyof UserData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save to localStorage only if available
      if (typeof window !== 'undefined') {
        localStorage.setItem('quiz-user-data', JSON.stringify(formData));
      }
      onLoginSuccess(formData);
    }
  };

  const handleShowTerms = () => {
    setShowTerms(true);
  };

  const handleCloseTerms = () => {
    setShowTerms(false);
  };

  return (
    <>
      <SimpleThemeToggle />
      <div className={`${styles.login} ${className}`}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>Welcome to Quiz App</h1>
            <p className={styles.loginSubtitle}>Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                placeholder="Enter your phone number"
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Enter your password"
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreedToTerms}
                  onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                  className={styles.checkbox}
                />
                <label htmlFor="terms" className={styles.checkboxLabel}>
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={handleShowTerms}
                    className={styles.termsLink}
                  >
                    terms and conditions
                  </button>
                </label>
              </div>
              {errors.terms && <span className={styles.errorText}>{errors.terms}</span>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              className={styles.submitButton}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>

      {showTerms && (
        <div className={styles.modalOverlay} onClick={handleCloseTerms}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Terms and Conditions</h2>
              <button
                onClick={handleCloseTerms}
                className={styles.closeButton}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.termsSection}>
                <h3>Quiz Rules and Regulations</h3>
                <ul>
                  <li>• 10 multiple choice questions per quiz</li>
                  <li>• 20 seconds per question with countdown timer</li>
                  <li>• Total quiz time: 5 minutes</li>
                  <li>• Select one answer and submit before time runs out</li>
                  <li>• Auto-submit when time runs out</li>
                  <li>• No answer = 0 points for that question</li>
                  <li>• Questions will fade in/out smoothly between transitions</li>
                </ul>
              </div>

              <div className={styles.termsSection}>
                <h3>Data Collection</h3>
                <ul>
                  <li>• Your email, phone, and password are stored locally</li>
                  <li>• Quiz results are saved for review purposes</li>
                  <li>• No data is shared with third parties</li>
                  <li>• You can clear your data anytime</li>
                </ul>
              </div>

              <div className={styles.termsSection}>
                <h3>User Responsibilities</h3>
                <ul>
                  <li>• Provide accurate information during registration</li>
                  <li>• Complete quizzes honestly without external help</li>
                  <li>• Respect the time limits and rules</li>
                  <li>• Report any technical issues immediately</li>
                </ul>
              </div>

              <div className={styles.termsSection}>
                <h3>Privacy Policy</h3>
                <p>
                  Your privacy is important to us. All data is stored locally on your device
                  and is not transmitted to external servers. You have full control over
                  your data and can delete it at any time.
                </p>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button
                onClick={handleCloseTerms}
                variant="primary"
                size="medium"
              >
                I Understand
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
