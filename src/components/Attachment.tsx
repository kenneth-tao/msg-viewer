import React from 'react';
import { Attachment as AttachmentType } from '../types';
import { formatFileSize, getFileIcon } from '../utils/helpers';

interface AttachmentProps {
  attachment: AttachmentType;
  onClick: (attachment: AttachmentType) => void;
}

const Attachment: React.FC<AttachmentProps> = ({ attachment, onClick }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(attachment);
    }
  };

  return (
    <div 
      className="attachment-item"
      onClick={() => onClick(attachment)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Attachment: ${attachment.fileName}, Size: ${formatFileSize(attachment.size)}`}
    >
      <span className={`attachment-icon ${getFileIcon(attachment.fileName)}`} aria-hidden="true">
        📎
      </span>
      <span className="attachment-name">{attachment.fileName}</span>
      <span className="attachment-size">{formatFileSize(attachment.size)}</span>
    </div>
  );
};

export default Attachment;
