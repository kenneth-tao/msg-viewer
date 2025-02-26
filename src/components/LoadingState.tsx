import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="loading" role="status">
      <div className="loading-spinner" aria-label="Loading"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingState;
