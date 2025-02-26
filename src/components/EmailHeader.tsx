import React from 'react';
import { MsgFile } from '../types';
import { formatDate, formatEmails } from '../utils/helpers';

interface EmailHeaderProps {
  email: MsgFile;
}

const EmailHeader: React.FC<EmailHeaderProps> = ({ email }) => {
  return (
    <div className="email-header">
      <h1 className="email-subject">{email.subject}</h1>
      <div className="email-meta">
        <div className="email-meta-label">From:</div>
        <div className="email-meta-value">{email.from}</div>
        
        {email.displayTo && (
          <>
            <div className="email-meta-label">To:</div>
            <div className="email-meta-value">{email.displayTo}</div>
          </>
        )}
        
        {email.displayCc && (
          <>
            <div className="email-meta-label">CC:</div>
            <div className="email-meta-value">{email.displayCc}</div>
          </>
        )}
        
        {email.date && (
          <>
            <div className="email-meta-label">Date:</div>
            <div className="email-meta-value">{formatDate(email.date)}</div>
          </>
        )}
        
        {email.importance && email.importance !== 'normal' && (
          <>
            <div className="email-meta-label">Importance:</div>
            <div className="email-meta-value" style={{ 
              color: email.importance === 'high' ? 'var(--error-color)' : 'inherit',
              fontWeight: email.importance === 'high' ? 'bold' : 'normal'
            }}>
              {email.importance.charAt(0).toUpperCase() + email.importance.slice(1)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailHeader;
