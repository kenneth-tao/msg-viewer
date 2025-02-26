import React from 'react';
import { MsgFile } from '../types';
import { sanitizeHtml } from '../utils/helpers';

interface EmailBodyProps {
  email: MsgFile;
}

const EmailBody: React.FC<EmailBodyProps> = ({ email }) => {
  // Prefer HTML content if available, otherwise use plain text
  const hasHtmlContent = !!email.bodyHTML && email.bodyHTML.trim() !== '';
  
  // Create a sanitized version of the content
  const sanitizedContent = hasHtmlContent 
    ? sanitizeHtml(email.bodyHTML) 
    : email.body;
  
  return (
    <div className="email-body">
      <div className="email-body-content">
        {hasHtmlContent ? (
          // For HTML content, use dangerouslySetInnerHTML but with sanitized content
          <div 
            dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
            className="email-html-content"
          />
        ) : (
          // For plain text, preserve whitespace
          <pre className="email-text-content">{sanitizedContent}</pre>
        )}
      </div>
    </div>
  );
};

export default EmailBody;
