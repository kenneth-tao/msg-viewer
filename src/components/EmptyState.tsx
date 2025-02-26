import React from 'react';

interface EmptyStateProps {
  onOpenFile: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onOpenFile }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">📧</div>
      <h2 className="empty-state-text">No MSG file opened</h2>
      <p className="empty-state-subtext">
        Open an Outlook MSG file to view its contents
      </p>
      <button 
        className="btn btn-primary"
        onClick={onOpenFile}
        aria-label="Open MSG file"
      >
        <span className="btn-icon" aria-hidden="true">📂</span>
        Open MSG File
      </button>
    </div>
  );
};

export default EmptyState;
