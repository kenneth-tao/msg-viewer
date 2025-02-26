import React from 'react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="error" role="alert">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <h2 className="error-message">Error</h2>
      <p className="error-details">{message}</p>
      {onRetry && (
        <button 
          className="btn btn-primary"
          onClick={onRetry}
          aria-label="Try again"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
