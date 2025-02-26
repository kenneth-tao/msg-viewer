import React, { useState } from 'react';
import { Attachment, MsgFile } from '../types';
import EmailHeader from './EmailHeader';
import EmailBody from './EmailBody';
import AttachmentList from './AttachmentList';
import { hasAttachments } from '../utils/helpers';

interface EmailViewerProps {
  email: MsgFile;
  onSaveAttachment: (attachment: Attachment) => Promise<void>;
}

const EmailViewer: React.FC<EmailViewerProps> = ({ email, onSaveAttachment }) => {
  const [savingAttachment, setSavingAttachment] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const handleAttachmentClick = async (attachment: Attachment) => {
    try {
      setSavingAttachment(true);
      setSaveError(null);
      await onSaveAttachment(attachment);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save attachment');
      console.error('Error saving attachment:', error);
    } finally {
      setSavingAttachment(false);
    }
  };
  
  return (
    <div className="email-viewer">
      <EmailHeader email={email} />
      <EmailBody email={email} />
      
      {hasAttachments(email) && (
        <AttachmentList 
          attachments={email.attachments!} 
          onAttachmentClick={handleAttachmentClick}
        />
      )}
      
      {savingAttachment && (
        <div className="attachment-saving-overlay" aria-live="polite">
          <div className="loading-spinner" aria-label="Saving attachment"></div>
          <p>Saving attachment...</p>
        </div>
      )}
      
      {saveError && (
        <div className="attachment-error-message" role="alert">
          <p>Error saving attachment: {saveError}</p>
        </div>
      )}
    </div>
  );
};

export default EmailViewer;
